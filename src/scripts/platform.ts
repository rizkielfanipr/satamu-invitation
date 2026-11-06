/**
 * Prasetya Platform client. The platform owns prices, orders, checkout, and payment truth (ADR 0004); this module
 * never sends a price and never treats anything the browser sees as proof of payment.
 */

export interface OrderInput {
	packageCode: string;
	themeCode: string;
	name: string;
	email: string;
	/** Normalised to 62… */
	phone: string;
	eventType: string;
	/** Y-m-d */
	eventDate: string;
	notes: string;
}

export interface Price {
	amount: number;
	currency: string;
}

export interface PaymentStatus {
	invoice_number: string;
	order_status: string;
	payment_status: string | null;
	checkout_url: string | null;
}

/** `invalid`: the platform refused the input. `busy`: an identical request is still running. `not-found`: unknown order. */
export type PlatformFailure = 'invalid' | 'busy' | 'not-found' | 'unavailable';

export class PlatformError extends Error {
	constructor(public readonly failure: PlatformFailure) {
		super(failure);
		this.name = 'PlatformError';
	}
}

/** Where to send the customer after asking for a checkout. */
export type CheckoutOutcome = { kind: 'checkout'; url: string } | { kind: 'status'; reference: string };

interface Envelope<T> {
	success: boolean;
	data: T;
	error?: { code?: string };
}

const APPLICATION = 'SATAMU';
const INTENT_KEY = 'satamu.checkout.intent';
const LOCALE_KEY = 'satamu.checkout.locale';
const REFERENCE = /^[0-9a-z]{26}$/i;

export const isOrderReference = (value: string) => REFERENCE.test(value);

/** The payload the platform expects. No amount, currency, or status: those are the platform's to decide. */
export function orderPayload(order: OrderInput) {
	return {
		application_code: APPLICATION,
		package_code: order.packageCode,
		customer: { name: order.name, email: order.email, phone: order.phone },
		details: {
			theme_code: order.themeCode,
			event_type: order.eventType,
			event_date: order.eventDate,
			notes: order.notes.trim() === '' ? null : order.notes.trim(),
		},
	};
}

function failureFor(code: string | undefined): PlatformFailure {
	if (code === 'VALIDATION_FAILED' || code === 'IDEMPOTENCY_KEY_REUSED') return 'invalid';
	if (code === 'CHECKOUT_IN_PROGRESS' || code === 'IDEMPOTENCY_IN_PROGRESS') return 'busy';
	return 'unavailable';
}

async function sha256(text: string) {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

interface Intent {
	/** SHA-256 of the order payload, so storage holds no personal data. */
	fingerprint: string;
	orderKey: string;
	checkoutKey: string;
}

export function platformClient(baseUrl: string, storage: Storage = sessionStorage) {
	const origin = baseUrl ? new URL(baseUrl).origin : '';

	async function request<T>(path: string, init?: RequestInit): Promise<{ status: number; body: Envelope<T> }> {
		if (!baseUrl) throw new PlatformError('unavailable');
		try {
			const response = await fetch(`${baseUrl}/api/v1${path}`, {
				...init,
				headers: { Accept: 'application/json', ...init?.headers },
			});
			const body = (await response.json()) as Envelope<T>;
			if (typeof body !== 'object' || body === null || typeof body.success !== 'boolean') throw new Error('envelope');
			return { status: response.status, body };
		} catch {
			throw new PlatformError('unavailable');
		}
	}

	function post<T>(path: string, idempotencyKey: string, body?: unknown) {
		return request<T>(path, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	}

	/**
	 * A checkout address the browser may be sent to: HTTPS (Duitku), or the platform itself (its local fake gateway).
	 * Anything else in a response is ignored, so a tampered or broken answer cannot redirect the customer elsewhere.
	 */
	function isCheckoutUrl(value: unknown): value is string {
		if (typeof value !== 'string') return false;
		try {
			const url = new URL(value);
			if (url.username || url.password) return false;
			return url.protocol === 'https:' || url.origin === origin;
		} catch {
			return false;
		}
	}

	/** The same form content keeps the same keys across clicks and refreshes, so it can only ever create one order. */
	async function intentFor(payload: string): Promise<Intent> {
		const fingerprint = await sha256(payload);
		try {
			const stored = JSON.parse(storage.getItem(INTENT_KEY) ?? 'null') as Intent | null;
			if (stored?.fingerprint === fingerprint && stored.orderKey && stored.checkoutKey) return stored;
		} catch {
			// Unreadable entry: replaced below.
		}
		const fresh = { fingerprint, orderKey: crypto.randomUUID(), checkoutKey: crypto.randomUUID() };
		storage.setItem(INTENT_KEY, JSON.stringify(fresh));
		return fresh;
	}

	async function openCheckout(reference: string, key: string): Promise<CheckoutOutcome | 'expired-replay' | 'not-payable'> {
		const { body } = await post<{ checkout_url: string | null }>(`/orders/${reference}/checkout`, key);
		if (body.success) {
			if (isCheckoutUrl(body.data?.checkout_url)) return { kind: 'checkout', url: body.data.checkout_url };
			// A replayed key can point at an attempt that has ended since: it carries no usable URL.
			if (body.data?.checkout_url === null) return 'expired-replay';
			throw new PlatformError('unavailable');
		}
		if (body.error?.code === 'ORDER_ALREADY_PAID') return { kind: 'status', reference };
		if (body.error?.code === 'ORDER_NOT_PAYABLE') return 'not-payable';
		throw new PlatformError(failureFor(body.error?.code));
	}

	return {
		isCheckoutUrl,

		/** Price for display, always from the platform, so the dialog never shows a stale amount before paying. */
		async packagePrice(code: string): Promise<Price> {
			const { body } = await request<{ code: string; price: Price }[]>(`/packages?application_code=${APPLICATION}`);
			const item = body.success && Array.isArray(body.data) ? body.data.find((entry) => entry.code === code) : undefined;
			const amount = item?.price?.amount;
			if (!item || !Number.isInteger(amount) || (amount as number) <= 0 || typeof item.price.currency !== 'string') {
				throw new PlatformError('unavailable');
			}
			return { amount: amount as number, currency: item.price.currency };
		},

		/** Creates (or replays) the order and opens a checkout. A return from the checkout proves nothing. */
		async startPayment(order: OrderInput, locale: string): Promise<CheckoutOutcome> {
			const payload = orderPayload(order);
			const serialised = JSON.stringify(payload);
			const intent = await intentFor(serialised);

			const created = await post<{ reference: string }>('/orders', intent.orderKey, payload);
			if (!created.body.success) throw new PlatformError(failureFor(created.body.error?.code));
			const reference = created.body.data?.reference;
			if (typeof reference !== 'string' || !isOrderReference(reference)) throw new PlatformError('unavailable');

			storage.setItem(LOCALE_KEY, locale);

			// The intent's key first (a double click replays it); if that attempt has ended, one new key.
			for (const key of [intent.checkoutKey, crypto.randomUUID()]) {
				const outcome = await openCheckout(reference, key);
				if (outcome === 'not-payable') {
					storage.removeItem(INTENT_KEY); // The order has closed: the next try starts a new one.
					return { kind: 'status', reference };
				}
				if (outcome !== 'expired-replay') return outcome;
			}
			return { kind: 'status', reference };
		},

		/** A new attempt for an order whose last attempt failed or expired, always with a new key. */
		async retryPayment(reference: string): Promise<CheckoutOutcome> {
			const outcome = await openCheckout(reference, crypto.randomUUID());
			return outcome === 'not-payable' || outcome === 'expired-replay' ? { kind: 'status', reference } : outcome;
		},

		async paymentStatus(reference: string): Promise<PaymentStatus> {
			if (!isOrderReference(reference)) throw new PlatformError('not-found');
			const { status, body } = await request<PaymentStatus>(`/orders/${reference}/payment-status`);
			if (status === 404) throw new PlatformError('not-found');
			if (!body.success || typeof body.data?.invoice_number !== 'string') throw new PlatformError('unavailable');
			return { ...body.data, checkout_url: isCheckoutUrl(body.data.checkout_url) ? body.data.checkout_url : null };
		},

		checkoutLocale: () => storage.getItem(LOCALE_KEY),
	};
}

export type PlatformClient = ReturnType<typeof platformClient>;
