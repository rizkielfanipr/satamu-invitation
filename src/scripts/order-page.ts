import { site, onlinePayment } from '../config/site';
import { whatsappUrl } from './whatsapp';
import { platformClient, PlatformError, type PlatformClient } from './platform';
import {
	consultationMessage,
	formatEventDate,
	formatRupiah,
	localToday,
	orderFields,
	readPreselection,
	toOrderInput,
	validateOrder,
	type ConsultationCopy,
	type OrderErrorKey,
	type OrderField,
	type OrderValues,
} from './order-form';

/** Shape of the form's data-copy (OrderPage.astro). */
interface OrderCopy {
	site: string;
	errors: Record<OrderErrorKey | 'summary', string>;
	themes: Record<string, string>;
	packages: Record<string, string>;
	eventTypes: Record<string, string>;
	whatsapp: ConsultationCopy;
	dialog: {
		priceLoading: string;
		priceUnavailable: string;
		payUnavailable: string;
		failures: Record<'invalid' | 'busy' | 'unavailable', string>;
	};
}

export const STATUS_PATH = '/order/status/';

function control(form: HTMLFormElement, field: OrderField) {
	return form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
}

function readValues(form: HTMLFormElement): OrderValues {
	const value = (field: OrderField) => control(form, field)?.value ?? '';
	return {
		theme: value('theme'),
		package: value('package'),
		name: value('name'),
		email: value('email'),
		whatsapp: value('whatsapp'),
		eventType: value('eventType'),
		eventDate: value('eventDate'),
		notes: value('notes'),
		consent: (control(form, 'consent') as HTMLInputElement | null)?.checked ?? false,
	};
}

function setMessage(element: HTMLElement | null, text: string | null) {
	if (!element) return;
	const slot = element.querySelector<HTMLElement>('[data-error-text]') ?? element;
	slot.textContent = text ?? '';
	element.hidden = text === null;
}

/**
 * Validates on submit (and per field once a submit has failed), then opens the choice dialog. Payment goes through
 * the platform only; a second click while a request runs does nothing, and the idempotency keys make a replay safe.
 */
export function initOrderForm(
	form: HTMLFormElement,
	dialog: HTMLDialogElement,
	client: PlatformClient = platformClient(site.platformApiUrl),
) {
	const copy = JSON.parse(form.dataset.copy ?? '{}') as OrderCopy;
	const summary = form.querySelector<HTMLElement>('[data-order-error-summary]');
	const submit = form.querySelector<HTMLButtonElement>('[data-order-submit]');
	const title = dialog.querySelector<HTMLElement>('#order-dialog-title');
	const consult = dialog.querySelector<HTMLAnchorElement>('[data-order-consult]');
	const pay = dialog.querySelector<HTMLButtonElement>('[data-order-pay]');
	const payLabel = dialog.querySelector<HTMLElement>('[data-order-pay-label]');
	const price = dialog.querySelector<HTMLElement>('[data-summary="price"]');
	const dialogError = dialog.querySelector<HTMLElement>('[data-order-dialog-error]');
	const paymentOn = onlinePayment && dialog.dataset.onlinePayment === 'true' && pay !== null;
	const prices = new Map<string, Promise<number>>();
	let submitted = false;
	let paying = false;
	let current: OrderValues | null = null;

	// Preselection from a CTA, only when it names a known theme or package.
	const preselected = readPreselection(window.location.search);
	if (preselected.theme) (control(form, 'theme') as HTMLSelectElement).value = preselected.theme;
	if (preselected.package) (control(form, 'package') as HTMLSelectElement).value = preselected.package;
	control(form, 'eventDate')?.setAttribute('min', localToday());

	function showErrors(errors: Partial<Record<OrderField, OrderErrorKey>>) {
		for (const field of orderFields) {
			const key = errors[field];
			if (key) control(form, field)?.setAttribute('aria-invalid', 'true');
			else control(form, field)?.removeAttribute('aria-invalid');
			setMessage(form.querySelector<HTMLElement>(`[data-error-for="${field}"]`), key ? copy.errors[key] : null);
		}
	}

	form.addEventListener('input', () => {
		if (!submitted) return;
		const errors = validateOrder(readValues(form), localToday());
		showErrors(errors);
		if (Object.keys(errors).length === 0) setMessage(summary, null);
	});

	function priceFor(code: string) {
		let lookup = prices.get(code);
		if (!lookup) {
			lookup = client.packagePrice(code).then((result) => result.amount);
			lookup.catch(() => prices.delete(code)); // A failed lookup is retried the next time the dialog opens.
			prices.set(code, lookup);
		}
		return lookup;
	}

	function setPaying(busy: boolean) {
		paying = busy;
		if (!pay || !payLabel) return;
		pay.disabled = busy;
		pay.setAttribute('aria-busy', String(busy));
		payLabel.textContent = (busy ? pay.dataset.busyLabel : pay.dataset.label) ?? '';
	}

	async function loadPrice(code: string) {
		if (!paymentOn || !price || !pay) return;
		pay.disabled = true;
		price.textContent = copy.dialog.priceLoading;
		try {
			const amount = await priceFor(code);
			if (current?.package !== code) return; // The dialog was reopened for another package meanwhile.
			price.textContent = formatRupiah(amount);
			pay.disabled = paying;
		} catch {
			if (current?.package !== code) return;
			price.textContent = copy.dialog.priceUnavailable;
			setMessage(dialogError, copy.dialog.payUnavailable);
		}
	}

	function openDialog(values: OrderValues) {
		current = values;
		const event = `${copy.eventTypes[values.eventType]}, ${formatEventDate(values.eventDate)}`;
		const fill = (key: string, text: string) => {
			const cell = dialog.querySelector<HTMLElement>(`[data-summary="${key}"]`);
			if (cell) cell.textContent = text;
		};
		fill('theme', copy.themes[values.theme]);
		fill('package', copy.packages[values.package]);
		fill('event', event);
		if (consult) {
			consult.href = whatsappUrl(
				consultationMessage(
					{ ...copy.whatsapp, intro: copy.whatsapp.intro.replace('{site}', copy.site) },
					{ theme: copy.themes[values.theme], package: copy.packages[values.package], event, notes: values.notes },
				),
			);
		}
		setMessage(dialogError, null);
		dialog.showModal();
		title?.focus();
		void loadPrice(values.package);
	}

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		submitted = true;
		const values = readValues(form);
		const errors = validateOrder(values, localToday());
		showErrors(errors);
		const invalid = orderFields.filter((field) => errors[field] !== undefined);
		if (invalid.length > 0) {
			setMessage(summary, copy.errors.summary.replace('{count}', String(invalid.length)));
			control(form, invalid[0])?.focus();
			return;
		}
		setMessage(summary, null);
		openDialog(values);
	});

	dialog.querySelector('[data-order-dialog-close]')?.addEventListener('click', () => dialog.close());
	// A click on the backdrop lands on the <dialog> itself.
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog.close();
	});
	dialog.addEventListener('close', () => submit?.focus());

	pay?.addEventListener('click', async () => {
		if (paying || !current || !paymentOn) return;
		setPaying(true);
		setMessage(dialogError, null);
		try {
			const outcome = await client.startPayment(toOrderInput(current), document.documentElement.lang || 'id');
			// Leaving the page: the button stays busy so it cannot be used again before navigation.
			window.location.assign(outcome.kind === 'checkout' ? outcome.url : `${STATUS_PATH}?order=${outcome.reference}`);
		} catch (error) {
			const failure = error instanceof PlatformError && error.failure !== 'not-found' ? error.failure : 'unavailable';
			setMessage(dialogError, copy.dialog.failures[failure]);
			setPaying(false);
		}
	});
}
