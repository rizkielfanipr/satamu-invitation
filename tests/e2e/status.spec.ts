import { DUITKU, REFERENCE, expect, fail, mockPlatform, ok, status, test } from './support';

const statusUrl = `/order/status/?order=${REFERENCE}`;
const paymentStatus = `/orders/${REFERENCE}/payment-status`;

test('paid: payment received, manual processing, help link with the invoice only', async ({ page }) => {
	await mockPlatform(page, (call) => (call.path === paymentStatus ? status('CONFIRMED', 'PAID') : undefined));
	await page.goto(statusUrl);

	await expect(page.getByRole('heading', { name: 'Pembayaran diterima' })).toBeVisible();
	await expect(page.getByText('Tim Satamu akan menghubungimu')).toBeVisible();
	await expect(page.getByRole('status')).toHaveText('Pembayaran diterima');
	await expect(page.getByText('SAT-202611-000001')).toBeVisible();
	const help = decodeURIComponent((await page.getByRole('link', { name: 'Butuh bantuan? Chat WhatsApp' }).getAttribute('href')) ?? '');
	expect(help).toBe('https://wa.me/628995449805?text=Halo Satamu, saya butuh bantuan untuk pesanan SAT-202611-000001.');
});

test('ignores Duitku return parameters: a pending payment stays pending', async ({ page }) => {
	const calls = await mockPlatform(page, (call) =>
		call.path === paymentStatus ? status('PENDING_PAYMENT', 'PENDING', DUITKU) : undefined,
	);
	await page.goto(`${statusUrl}&resultCode=00&merchantOrderId=SAT-202611-000001&reference=DSAT1`);

	await expect(page.getByRole('heading', { name: 'Menunggu pembayaran' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Lanjutkan pembayaran' })).toHaveAttribute('href', DUITKU);
	expect(calls.every((call) => call.method === 'GET')).toBe(true);
});

test('pending becomes paid when the platform confirms it', async ({ page }) => {
	let polls = 0;
	await page.clock.install();
	await mockPlatform(page, (call) =>
		call.path === paymentStatus ? (++polls < 2 ? status('PENDING_PAYMENT', 'PENDING', DUITKU) : status('CONFIRMED', 'PAID')) : undefined,
	);
	await page.goto(statusUrl);
	await expect(page.getByRole('heading', { name: 'Menunggu pembayaran' })).toBeVisible();

	await page.clock.runFor(5500);
	await expect(page.getByRole('heading', { name: 'Pembayaran diterima' })).toBeVisible();
	await expect(page.getByRole('status')).toHaveText('Pembayaran diterima');
});

test('retry: a failed attempt can be paid again with a new key', async ({ page }) => {
	const calls = await mockPlatform(page, (call) => {
		if (call.path === paymentStatus) return status('PENDING_PAYMENT', 'EXPIRED');
		if (call.path === `/orders/${REFERENCE}/checkout`) return ok({ checkout_url: DUITKU }, 201);
		return undefined;
	});
	await page.goto(statusUrl);

	await expect(page.getByRole('heading', { name: 'Pembayaran belum selesai' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Lanjutkan pembayaran' })).toBeHidden();
	await page.getByRole('button', { name: 'Coba bayar lagi' }).click();

	await expect(page).toHaveURL(DUITKU);
	const checkout = calls.find((call) => call.method === 'POST');
	expect(checkout?.path).toBe(`/orders/${REFERENCE}/checkout`);
	expect(checkout?.key).toMatch(/^[0-9a-f-]{36}$/);
});

test('retry failure is announced and the button comes back', async ({ page }) => {
	await mockPlatform(page, (call) =>
		call.path === paymentStatus ? status('PENDING_PAYMENT', 'FAILED') : fail('GATEWAY_UNAVAILABLE', 502),
	);
	await page.goto(statusUrl);
	await page.getByRole('button', { name: 'Coba bayar lagi' }).click();

	await expect(page.getByRole('alert')).toContainText('Pembayaran belum dapat dibuat');
	await expect(page.getByRole('button', { name: 'Coba bayar lagi' })).toBeEnabled();
});

test('closed: an expired order offers a new order', async ({ page }) => {
	await mockPlatform(page, (call) => (call.path === paymentStatus ? status('EXPIRED', 'EXPIRED') : undefined));
	await page.goto(statusUrl);

	await expect(page.getByRole('heading', { name: 'Pesanan ditutup' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Buat pesanan baru' })).toHaveAttribute('href', '/order/');
});

test('invalid: a malformed reference is not sent, an unknown one is reported', async ({ page }) => {
	const calls = await mockPlatform(page, () => fail('NOT_FOUND', 404));
	await page.goto('/order/status/?order=..%2Fpackages');
	await expect(page.getByRole('heading', { name: 'Pesanan tidak ditemukan' })).toBeVisible();
	expect(calls).toHaveLength(0);

	await page.goto(statusUrl);
	await expect(page.getByRole('heading', { name: 'Pesanan tidak ditemukan' })).toBeVisible();
	const help = decodeURIComponent((await page.getByRole('link', { name: 'Butuh bantuan? Chat WhatsApp' }).getAttribute('href')) ?? '');
	expect(help).toBe('https://wa.me/628995449805?text=Halo Satamu, saya butuh bantuan untuk pesanan undangan saya.');
});

test('unavailable: the platform is down, then recovers on refresh', async ({ page }) => {
	let up = false;
	await mockPlatform(page, (call) => (call.path === paymentStatus ? (up ? status('CONFIRMED', 'PAID') : 'abort') : undefined));
	await page.goto(statusUrl);

	await expect(page.getByRole('heading', { name: 'Status belum dapat dimuat' })).toBeVisible();
	up = true;
	await page.getByRole('button', { name: 'Perbarui status' }).click();
	await expect(page.getByRole('heading', { name: 'Pembayaran diterima' })).toBeVisible();
});
