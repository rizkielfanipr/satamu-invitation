import { site } from '../config/site';
import { whatsappUrl } from './whatsapp';
import { isOrderReference, platformClient, PlatformError, type PaymentStatus, type PlatformClient } from './platform';

export type StatusView = 'loading' | 'paid' | 'pending' | 'retry' | 'closed' | 'invalid' | 'unavailable';

/** Only what the platform reports decides the view. Arriving back from Duitku proves nothing (ADR 0004). */
export function viewFor(status: PaymentStatus): StatusView {
	if (status.payment_status === 'PAID' || status.order_status === 'CONFIRMED') return 'paid';
	if (status.order_status !== 'PENDING_PAYMENT') return 'closed';
	if (status.payment_status === 'PENDING' || status.payment_status === 'CREATED') return 'pending';
	return 'retry'; // FAILED, EXPIRED, or no attempt yet: the order can still be paid.
}

const POLL_MS = 5000;
const POLL_LIMIT = 36; // Three minutes; after that "Perbarui status" stays available.

export function initOrderStatus(root: HTMLElement, client: PlatformClient = platformClient(site.platformApiUrl), poll = POLL_MS) {
	const reference = new URLSearchParams(window.location.search).get('order')?.trim() ?? '';
	const announce = root.querySelector<HTMLElement>('[data-status-announce]');
	const invoice = root.querySelector<HTMLElement>('[data-status-invoice]');
	const invoiceRow = root.querySelector<HTMLElement>('[data-status-invoice-row]');
	const help = root.querySelector<HTMLAnchorElement>('[data-status-help]');
	const resume = root.querySelector<HTMLAnchorElement>('[data-status-resume]');
	const retry = root.querySelector<HTMLButtonElement>('[data-status-retry]');
	const retryLabel = root.querySelector<HTMLElement>('[data-status-retry-label]');
	const retryError = root.querySelector<HTMLElement>('[data-status-retry-error]');
	let shown: StatusView | null = null;
	let polls = 0;
	let timer: number | undefined;

	function show(view: StatusView) {
		root.querySelectorAll<HTMLElement>('[data-status-view]').forEach((panel) => {
			panel.hidden = panel.dataset.statusView !== view;
		});
		root.dataset.view = view;
		// Announce a change of state once, not every poll.
		if (view !== shown && announce) {
			announce.textContent = root.querySelector<HTMLElement>(`[data-status-view="${view}"] [data-status-title]`)?.textContent ?? '';
		}
		shown = view;
	}

	function setHelp(invoiceNumber: string | null) {
		if (!help) return;
		const message = invoiceNumber
			? (help.dataset.message ?? '').replace('{site}', site.name).replace('{invoice}', invoiceNumber)
			: (help.dataset.messageGeneric ?? '').replace('{site}', site.name);
		help.href = whatsappUrl(message);
	}

	async function refresh() {
		window.clearTimeout(timer);
		let status: PaymentStatus;
		try {
			status = await client.paymentStatus(reference);
		} catch (error) {
			show(error instanceof PlatformError && error.failure === 'not-found' ? 'invalid' : 'unavailable');
			return;
		}
		const view = viewFor(status);
		if (invoice) invoice.textContent = status.invoice_number;
		if (invoiceRow) invoiceRow.hidden = false;
		setHelp(status.invoice_number);
		if (resume) {
			resume.hidden = view !== 'pending' || !status.checkout_url;
			resume.href = status.checkout_url ?? '#';
		}
		show(view);
		if (view === 'pending' && polls < POLL_LIMIT) {
			polls += 1;
			timer = window.setTimeout(() => void refresh(), poll);
		}
	}

	root.querySelectorAll<HTMLButtonElement>('[data-status-refresh]').forEach((button) =>
		button.addEventListener('click', () => {
			polls = 0;
			show('loading');
			void refresh();
		}),
	);

	retry?.addEventListener('click', async () => {
		if (retry.disabled) return;
		retry.disabled = true;
		retry.setAttribute('aria-busy', 'true');
		if (retryLabel) retryLabel.textContent = retry.dataset.busyLabel ?? '';
		if (retryError) retryError.hidden = true;
		try {
			const outcome = await client.retryPayment(reference);
			if (outcome.kind === 'checkout') {
				window.location.assign(outcome.url);
				return;
			}
			await refresh();
		} catch {
			if (retryError) retryError.hidden = false;
		}
		retry.disabled = false;
		retry.removeAttribute('aria-busy');
		if (retryLabel) retryLabel.textContent = retry.dataset.label ?? '';
	});

	setHelp(null);
	if (!isOrderReference(reference)) {
		show('invalid');
		return;
	}
	show('loading');
	void refresh();
}
