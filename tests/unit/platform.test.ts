import { beforeEach, describe, expect, it, vi } from 'vitest';
import { orderPayload, platformClient, PlatformError, type OrderInput } from '../../src/scripts/platform';

const BASE = 'https://platform.test';
const REFERENCE = '01jc8z3k5m7n9p1q3r5s7t9v0w';
const DUITKU = 'https://app-sandbox.duitku.com/redirect_checkout?reference=DSAT1';

const order: OrderInput = {
	packageCode: 'SAT-SPESIAL',
	themeCode: 'T01',
	name: 'Sari Lestari',
	email: 'sari@example.com',
	phone: '6281234567890',
	eventType: 'wedding',
	eventDate: '2027-02-20',
	notes: '',
};

interface Call {
	method: string;
	path: string;
	key: string | null;
	body: unknown;
}

type Handler = (call: Call) => { status?: number; body: unknown } | 'network-error';

/** Stubs fetch with a handler per request and records each call. */
function stubPlatform(handler: Handler) {
	const calls: Call[] = [];
	vi.stubGlobal(
		'fetch',
		vi.fn(async (input: string, init?: RequestInit) => {
			const headers = new Headers(init?.headers);
			const call = {
				method: init?.method ?? 'GET',
				path: ((url) => url.pathname.replace(/^\/api\/v1/, '') + url.search)(new URL(input)),
				key: headers.get('Idempotency-Key'),
				body: init?.body ? JSON.parse(String(init.body)) : undefined,
			};
			calls.push(call);
			const answer = handler(call);
			if (answer === 'network-error') throw new TypeError('Failed to fetch');
			return new Response(JSON.stringify(answer.body), { status: answer.status ?? 200, headers: { 'Content-Type': 'application/json' } });
		}),
	);
	return calls;
}

const ok = (data: unknown, status = 200) => ({ status, body: { success: true, data } });
const fail = (code: string, status: number) => ({ status, body: { success: false, data: null, error: { code } } });

/** A platform that creates the order and opens a Duitku checkout. */
const happy: Handler = (call) => (call.path === '/orders' ? ok({ reference: REFERENCE }, 201) : ok({ checkout_url: DUITKU }, 201));

beforeEach(() => sessionStorage.clear());

describe('packagePrice', () => {
	it('reads the Satamu catalogue and picks the package by code', async () => {
		const calls = stubPlatform(() =>
			ok([
				{ code: 'SAT-SEDERHANA', price: { amount: 49000, currency: 'IDR' } },
				{ code: 'SAT-SPESIAL', price: { amount: 85000, currency: 'IDR' } },
			]),
		);

		await expect(platformClient(BASE).packagePrice('SAT-SPESIAL')).resolves.toEqual({ amount: 85000, currency: 'IDR' });
		expect(calls).toEqual([expect.objectContaining({ method: 'GET', path: '/packages?application_code=SATAMU' })]);
	});

	it.each<[string, Handler]>([
		['package not offered (inactive)', () => ok([{ code: 'SAT-SEDERHANA', price: { amount: 49000, currency: 'IDR' } }])],
		['malformed amount', () => ok([{ code: 'SAT-SPESIAL', price: { amount: '79000', currency: 'IDR' } }])],
		['zero amount', () => ok([{ code: 'SAT-SPESIAL', price: { amount: 0, currency: 'IDR' } }])],
		['error envelope', () => fail('INTERNAL', 500)],
		['not JSON', () => ({ body: 'oops' })],
		['network down', () => 'network-error'],
	])('is unavailable when %s', async (_, handler) => {
		stubPlatform(handler);
		await expect(platformClient(BASE).packagePrice('SAT-SPESIAL')).rejects.toEqual(new PlatformError('unavailable'));
	});

	it('makes no request when online payment is off', async () => {
		const calls = stubPlatform(happy);
		await expect(platformClient('').packagePrice('SAT-SPESIAL')).rejects.toEqual(new PlatformError('unavailable'));
		expect(calls).toHaveLength(0);
	});
});

describe('orderPayload', () => {
	it('is the documented Satamu order, with no price, amount, currency, or status', () => {
		const payload = orderPayload({ ...order, notes: '  ' });

		expect(payload).toEqual({
			application_code: 'SATAMU',
			package_code: 'SAT-SPESIAL',
			customer: { name: 'Sari Lestari', email: 'sari@example.com', phone: '6281234567890' },
			details: { theme_code: 'T01', event_type: 'wedding', event_date: '2027-02-20', notes: null },
		});
		expect(JSON.stringify(payload)).not.toMatch(/price|amount|total|currency|status/i);
	});
});

describe('startPayment', () => {
	it('creates the order, opens checkout with idempotency keys, and returns the Duitku URL', async () => {
		const calls = stubPlatform(happy);

		await expect(platformClient(BASE).startPayment(order, 'id')).resolves.toEqual({ kind: 'checkout', url: DUITKU });

		expect(calls.map((call) => `${call.method} ${call.path}`)).toEqual(['POST /orders', `POST /orders/${REFERENCE}/checkout`]);
		expect(calls[0].body).toEqual(orderPayload(order));
		expect(calls[0].key).toMatch(/^[0-9a-f-]{36}$/);
		expect(calls[1].key).toMatch(/^[0-9a-f-]{36}$/);
		expect(calls[1].key).not.toBe(calls[0].key);
	});

	it('replays the same keys for the same intent, so a double click creates one order', async () => {
		const calls = stubPlatform(happy);
		const client = platformClient(BASE);

		await Promise.all([client.startPayment(order, 'id'), client.startPayment(order, 'id')]);
		await client.startPayment(order, 'id');

		const orderKeys = new Set(calls.filter((call) => call.path === '/orders').map((call) => call.key));
		const checkoutKeys = new Set(calls.filter((call) => call.path.endsWith('/checkout')).map((call) => call.key));
		expect(orderKeys.size).toBe(1);
		expect(checkoutKeys.size).toBe(1);
	});

	it('uses new keys when the order content changes', async () => {
		const calls = stubPlatform(happy);
		const client = platformClient(BASE);

		await client.startPayment(order, 'id');
		await client.startPayment({ ...order, packageCode: 'SAT-ISTIMEWA' }, 'id');

		const keys = calls.filter((call) => call.path === '/orders').map((call) => call.key);
		expect(keys[0]).not.toBe(keys[1]);
	});

	it('keeps only keys and locale in sessionStorage, never personal or payment data', async () => {
		stubPlatform(happy);
		await platformClient(BASE).startPayment(order, 'id');

		const stored = Object.keys(sessionStorage)
			.map((key) => `${key}=${sessionStorage.getItem(key)}`)
			.join('\n');
		expect(stored).not.toContain('Sari');
		expect(stored).not.toContain('sari@example.com');
		expect(stored).not.toContain('6281234567890');
		expect(stored).not.toContain('SAT-SPESIAL');
		expect(stored).not.toContain('duitku');
		expect(sessionStorage.getItem('satamu.checkout.locale')).toBe('id');
		expect(Object.keys(JSON.parse(sessionStorage.getItem('satamu.checkout.intent') ?? '{}')).sort()).toEqual([
			'checkoutKey',
			'fingerprint',
			'orderKey',
		]);
	});

	it('opens a new attempt with a new key when the replayed one has ended', async () => {
		let checkouts = 0;
		const calls = stubPlatform((call) => {
			if (call.path === '/orders') return ok({ reference: REFERENCE }, 201);
			checkouts += 1;
			return ok({ checkout_url: checkouts === 1 ? null : DUITKU }, 201); // First: a replay of an expired attempt.
		});

		await expect(platformClient(BASE).startPayment(order, 'id')).resolves.toEqual({ kind: 'checkout', url: DUITKU });
		const keys = calls.filter((call) => call.path.endsWith('/checkout')).map((call) => call.key);
		expect(keys).toHaveLength(2);
		expect(keys[0]).not.toBe(keys[1]);
	});

	it.each([['javascript:alert(1)'], ['http://evil.example/pay'], ['https://user:pass@app.duitku.com/pay'], ['//evil.example'], [42]])(
		'never redirects to %s',
		async (url) => {
			stubPlatform((call) => (call.path === '/orders' ? ok({ reference: REFERENCE }, 201) : ok({ checkout_url: url }, 201)));
			await expect(platformClient(BASE).startPayment(order, 'id')).rejects.toEqual(new PlatformError('unavailable'));
		},
	);

	it('accepts the platform itself as checkout (local fake gateway over http)', async () => {
		const local = 'http://localhost:8000';
		const fake = `${local}/dev/fake-checkout/SAT-202611-000001`;
		stubPlatform((call) => (call.path === '/orders' ? ok({ reference: REFERENCE }, 201) : ok({ checkout_url: fake }, 201)));

		await expect(platformClient(local).startPayment(order, 'id')).resolves.toEqual({ kind: 'checkout', url: fake });
	});

	it('sends the customer to the status page when the order is already paid', async () => {
		stubPlatform((call) => (call.path === '/orders' ? ok({ reference: REFERENCE }) : fail('ORDER_ALREADY_PAID', 409)));
		await expect(platformClient(BASE).startPayment(order, 'id')).resolves.toEqual({ kind: 'status', reference: REFERENCE });
	});

	it('forgets the intent when the order can no longer be paid, so the next try is a new order', async () => {
		stubPlatform((call) => (call.path === '/orders' ? ok({ reference: REFERENCE }) : fail('ORDER_NOT_PAYABLE', 409)));
		await expect(platformClient(BASE).startPayment(order, 'id')).resolves.toEqual({ kind: 'status', reference: REFERENCE });
		expect(sessionStorage.getItem('satamu.checkout.intent')).toBeNull();
	});

	it.each([
		['VALIDATION_FAILED', 422, 'invalid'],
		['PACKAGE_INACTIVE', 422, 'unavailable'],
		['IDEMPOTENCY_IN_PROGRESS', 409, 'busy'],
		['RATE_LIMITED', 429, 'unavailable'],
	])('maps an order refusal %s to %s', async (code, status, failure) => {
		stubPlatform(() => fail(code, status));
		await expect(platformClient(BASE).startPayment(order, 'id')).rejects.toEqual(new PlatformError(failure as never));
	});

	it('reports a checkout still being created as busy', async () => {
		stubPlatform((call) => (call.path === '/orders' ? ok({ reference: REFERENCE }) : fail('CHECKOUT_IN_PROGRESS', 409)));
		await expect(platformClient(BASE).startPayment(order, 'id')).rejects.toEqual(new PlatformError('busy'));
	});

	it('is unavailable when the platform is down', async () => {
		stubPlatform(() => 'network-error');
		await expect(platformClient(BASE).startPayment(order, 'id')).rejects.toEqual(new PlatformError('unavailable'));
	});
});

describe('retryPayment', () => {
	it('uses a new key every time', async () => {
		const calls = stubPlatform(() => ok({ checkout_url: DUITKU }, 201));
		const client = platformClient(BASE);

		await client.retryPayment(REFERENCE);
		await client.retryPayment(REFERENCE);

		expect(calls[0].path).toBe(`/orders/${REFERENCE}/checkout`);
		expect(calls[0].key).not.toBe(calls[1].key);
	});
});

describe('paymentStatus', () => {
	it('returns the platform status and drops an unsafe checkout URL', async () => {
		stubPlatform(() =>
			ok({
				invoice_number: 'SAT-202611-000001',
				order_status: 'PENDING_PAYMENT',
				payment_status: 'PENDING',
				checkout_url: 'http://evil.example',
			}),
		);

		await expect(platformClient(BASE).paymentStatus(REFERENCE)).resolves.toMatchObject({ payment_status: 'PENDING', checkout_url: null });
	});

	it('treats an unknown order as not found and a malformed reference without asking', async () => {
		const calls = stubPlatform(() => fail('NOT_FOUND', 404));

		await expect(platformClient(BASE).paymentStatus(REFERENCE)).rejects.toEqual(new PlatformError('not-found'));
		await expect(platformClient(BASE).paymentStatus('../packages')).rejects.toEqual(new PlatformError('not-found'));
		expect(calls).toHaveLength(1);
	});

	it('is unavailable when the platform is down', async () => {
		stubPlatform(() => 'network-error');
		await expect(platformClient(BASE).paymentStatus(REFERENCE)).rejects.toEqual(new PlatformError('unavailable'));
	});
});
