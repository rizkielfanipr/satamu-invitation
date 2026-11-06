import { test as base, expect, type Page, type Request } from '@playwright/test';
import { PLATFORM } from '../../playwright.config';

export const REFERENCE = '01jc8z3k5m7n9p1q3r5s7t9v0w';
export const DUITKU = 'https://app-sandbox.duitku.com/redirect_checkout?reference=DSAT1';
export const CATALOGUE = [
	{ code: 'SAT-SEDERHANA', application_code: 'SATAMU', name: 'Sederhana', price: { amount: 49000, currency: 'IDR' } },
	// Deliberately not the static Rp79.000: the dialog must show the platform's price.
	{ code: 'SAT-SPESIAL', application_code: 'SATAMU', name: 'Spesial', price: { amount: 85000, currency: 'IDR' } },
	{ code: 'SAT-ISTIMEWA', application_code: 'SATAMU', name: 'Istimewa', price: { amount: 149000, currency: 'IDR' } },
];

export interface PlatformCall {
	method: string;
	path: string;
	key: string | null;
	body: unknown;
}

type Reply = { status?: number; body: unknown; delayMs?: number } | 'abort';
export type PlatformHandler = (call: PlatformCall) => Reply | undefined;

export const ok = (data: unknown, status = 200): Reply => ({ status, body: { success: true, data, meta: {} } });
export const fail = (code: string, status: number): Reply => ({
	status,
	body: { success: false, data: null, error: { code, message: code } },
});

/** Default platform: catalogue, order, and a Duitku checkout. */
export const happyPlatform: PlatformHandler = (call) => {
	if (call.path.startsWith('/packages')) return ok(CATALOGUE);
	if (call.method === 'POST' && call.path === '/orders') return ok({ reference: REFERENCE, invoice_number: 'SAT-202611-000001' }, 201);
	if (call.method === 'POST' && call.path.endsWith('/checkout')) return ok({ checkout_url: DUITKU, payment_status: 'PENDING' }, 201);
	return undefined;
};

export const status = (order_status: string, payment_status: string | null, checkout_url: string | null = null) =>
	ok({ order_reference: REFERENCE, invoice_number: 'SAT-202611-000001', order_status, payment_status, checkout_url });

function callOf(request: Request): PlatformCall {
	const url = new URL(request.url());
	const raw = request.postData();
	return {
		method: request.method(),
		path: url.pathname.replace(/^\/api\/v1/, '') + url.search,
		key: request.headers()['idempotency-key'] ?? null,
		body: raw ? JSON.parse(raw) : undefined,
	};
}

/** Answers the platform origin; records every call except CORS preflights. */
export async function mockPlatform(page: Page, handler: PlatformHandler = happyPlatform) {
	const calls: PlatformCall[] = [];
	await page.route(`${PLATFORM}/**`, async (route) => {
		const request = route.request();
		const cors = {
			'Access-Control-Allow-Origin': new URL(page.url() || 'http://localhost').origin,
			'Access-Control-Allow-Headers': 'Accept, Content-Type, Idempotency-Key',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		};
		if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
		const call = callOf(request);
		calls.push(call);
		const reply = handler(call) ?? fail('NOT_FOUND', 404);
		if (reply === 'abort') return route.abort('connectionrefused');
		if (reply.delayMs) await new Promise((resolve) => setTimeout(resolve, reply.delayMs));
		return route.fulfill({ status: reply.status ?? 200, headers: cors, contentType: 'application/json', body: JSON.stringify(reply.body) });
	});
	return calls;
}

export const test = base.extend<{ consoleErrors: string[] }>({
	consoleErrors: [
		async ({ page }, use) => {
			const errors: string[] = [];
			// Offline and fast: fonts are stubbed, the Duitku page is a placeholder.
			await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }));
			await page.route('https://app-sandbox.duitku.com/**', (route) =>
				route.fulfill({ contentType: 'text/html', body: '<title>Duitku</title>' }),
			);
			await page.route('http://evil.example/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>evil</title>' }));
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				// Requests the test aborts on purpose ("platform down") are logged by Chromium as resource errors.
				if (message.type() === 'error' && !/Failed to load resource|ERR_CONNECTION_REFUSED|ERR_FAILED/.test(message.text())) {
					errors.push(message.text());
				}
			});
			await use(errors);
			expect(errors, 'console errors').toEqual([]);
		},
		{ auto: true },
	],
});

export { expect };

/** Fills a valid order. Event date is far enough ahead to stay valid. */
export async function fillOrder(page: Page, overrides: { theme?: string; package?: string } = {}) {
	if (overrides.theme !== undefined) await page.getByLabel('Tema', { exact: true }).selectOption(overrides.theme);
	if (overrides.package !== undefined) await page.getByLabel('Paket', { exact: true }).selectOption(overrides.package);
	await page.getByLabel('Nama lengkap', { exact: true }).fill('Sari Lestari');
	await page.getByLabel('Email', { exact: true }).fill('sari@example.com');
	await page.getByLabel('Nomor WhatsApp', { exact: true }).fill('0812 3456 7890');
	await page.getByLabel('Jenis acara', { exact: true }).selectOption('wedding');
	await page.getByLabel('Tanggal acara', { exact: true }).fill('2027-02-20');
	await page.getByLabel('Catatan (opsional)', { exact: true }).fill('Adat Jawa');
	await page.getByRole('checkbox').check();
}

export const dialog = (page: Page) => page.getByRole('dialog', { name: 'Ringkasan pesanan' });

/** Width beyond the viewport, in px; 0 means no horizontal scroll. */
export const horizontalOverflow = (page: Page) =>
	page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
