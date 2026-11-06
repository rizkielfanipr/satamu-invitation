import { CATALOGUE, DUITKU, REFERENCE, dialog, expect, fail, fillOrder, happyPlatform, mockPlatform, ok, test } from './support';

test.describe('order context from CTAs', () => {
	test('Pilih Paket, Pakai Tema, hero, and header open the form with their choice', async ({ page }) => {
		await mockPlatform(page);
		await page.goto('/');

		await expect(page.getByRole('link', { name: 'Buat Undangan Sekarang' })).toHaveAttribute('href', '/order/');
		await expect(page.getByRole('banner').getByRole('link', { name: 'Order Sekarang' })).toHaveAttribute('href', '/order/');

		await page.getByRole('link', { name: 'Pilih paket Istimewa' }).click();
		await expect(page).toHaveURL('/order/?package=SAT-ISTIMEWA');
		await expect(page.getByLabel('Paket', { exact: true })).toHaveValue('SAT-ISTIMEWA');
		await expect(page.getByLabel('Tema', { exact: true })).toHaveValue('');

		await page.goto('/themes/');
		await page.getByRole('link', { name: 'Pakai template ini Kembang Setaman' }).click();
		await expect(page).toHaveURL('/order/?theme=T02');
		await expect(page.getByLabel('Tema', { exact: true })).toHaveValue('T02');
	});

	test('ignores unknown theme and package values', async ({ page }) => {
		await mockPlatform(page);
		await page.goto('/order/?theme=T99&package=PW-LANDING-STARTER&notes=%3Cscript%3E');

		await expect(page.getByLabel('Tema', { exact: true })).toHaveValue('');
		await expect(page.getByLabel('Paket', { exact: true })).toHaveValue('');
		await expect(page.getByLabel('Catatan')).toHaveValue('');
	});
});

test.describe('validation', () => {
	test('announces errors, links them to fields, and focuses the first', async ({ page }) => {
		await mockPlatform(page);
		await page.goto('/order/');
		await page.getByRole('button', { name: 'Lanjutkan' }).click();

		await expect(page.getByRole('alert').filter({ hasText: 'Ada 8 isian yang perlu diperiksa.' })).toBeVisible();
		await expect(page.getByLabel('Tema', { exact: true })).toBeFocused();
		await expect(dialog(page)).toBeHidden();

		for (const [label, message] of [
			['Tema', 'Pilih tema undangan.'],
			['Paket', 'Pilih paket.'],
			['Nama lengkap', 'Isi nama lengkap.'],
			['Email', 'Isi email.'],
			['Nomor WhatsApp', 'Isi nomor WhatsApp.'],
			['Jenis acara', 'Pilih jenis acara.'],
			['Tanggal acara', 'Isi tanggal acara.'],
		]) {
			const field = page.getByLabel(label, { exact: true });
			await expect(field).toHaveAttribute('aria-invalid', 'true');
			await expect(field).toHaveAccessibleDescription(new RegExp(message.replace('.', '\\.')));
		}
		await expect(page.getByRole('checkbox')).toHaveAccessibleDescription('Setujui ketentuan dan kebijakan privasi untuk melanjutkan.');

		await page.getByLabel('Email', { exact: true }).fill('sari@');
		await expect(page.getByLabel('Email', { exact: true })).toHaveAccessibleDescription(/Format email belum benar/);
		await page.getByLabel('Nomor WhatsApp', { exact: true }).fill('021 555 1234');
		await expect(page.getByLabel('Nomor WhatsApp', { exact: true })).toHaveAccessibleDescription(/nomor Indonesia/);
		await page.getByLabel('Tanggal acara', { exact: true }).fill('2020-01-01');
		await expect(page.getByLabel('Tanggal acara', { exact: true })).toHaveAccessibleDescription(/tidak boleh sebelum hari ini/);

		await fillOrder(page, { theme: 'T01', package: 'SAT-SPESIAL' });
		await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await expect(dialog(page)).toBeVisible();
	});

	test('consent links to the privacy page in a new tab', async ({ page }) => {
		await mockPlatform(page);
		await page.goto('/order/');
		const link = page.getByRole('link', { name: 'ketentuan dan kebijakan privasi' });

		await expect(link).toHaveAttribute('href', '/privacy/');
		await expect(link).toHaveAttribute('target', '_blank');
	});
});

test.describe('choice dialog', () => {
	test('shows the platform price for the package, with focus management and Escape', async ({ page }) => {
		const calls = await mockPlatform(page);
		await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();

		const modal = dialog(page);
		await expect(modal.getByRole('heading', { name: 'Ringkasan pesanan' })).toBeFocused();
		await expect(modal).toContainText('Arunika (T01)');
		await expect(modal).toContainText('Spesial');
		await expect(modal).toContainText('Pernikahan, 20 Februari 2027');
		await expect(modal).toContainText('Rp85.000');
		await expect(modal).not.toContainText('Rp79.000');
		for (const text of [
			'sistem pembayaran',
			'setelah pembayaran diterima dan materi undangan lengkap',
			'diproses oleh Duitku',
			'belum tentu berarti pembayaran berhasil',
			'Konsultasi lewat WhatsApp tetap tersedia',
		]) {
			await expect(modal).toContainText(text);
		}
		await expect(modal.getByRole('button', { name: 'Langsung bayar' })).toBeEnabled();
		expect(calls.filter((call) => call.path.startsWith('/packages')).map((call) => call.path)).toEqual([
			'/packages?application_code=SATAMU',
		]);

		const consult = modal.getByRole('link', { name: 'Konsultasi dulu' });
		const href = decodeURIComponent((await consult.getAttribute('href')) ?? '');
		expect(href).toMatch(/^https:\/\/wa\.me\/628995449805\?text=/);
		expect(href).toContain('Tema: Arunika (T01)');
		expect(href).toContain('Catatan: Adat Jawa');
		expect(href).not.toContain('sari@example.com');
		expect(href).not.toContain('0812');

		await page.keyboard.press('Escape');
		await expect(modal).toBeHidden();
		await expect(page.getByRole('button', { name: 'Lanjutkan' })).toBeFocused();

		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await modal.getByRole('button', { name: 'Tutup' }).click();
		await expect(modal).toBeHidden();
	});

	test('keeps WhatsApp when the platform is down, with payment disabled', async ({ page }) => {
		await mockPlatform(page, () => 'abort');
		await page.goto('/order/?theme=T03&package=SAT-SEDERHANA');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();

		const modal = dialog(page);
		await expect(modal).toContainText('Harga belum dapat dimuat');
		await expect(modal.getByRole('alert')).toContainText('Kamu tetap bisa konsultasi lewat WhatsApp');
		await expect(modal.getByRole('button', { name: 'Langsung bayar' })).toBeDisabled();
		await expect(modal.getByRole('link', { name: 'Konsultasi dulu' })).toHaveAttribute('href', /^https:\/\/wa\.me\//);
	});

	test('keeps WhatsApp when the package is not offered by the platform', async ({ page }) => {
		await mockPlatform(page, (call) =>
			call.path.startsWith('/packages') ? ok(CATALOGUE.filter((item) => item.code !== 'SAT-ISTIMEWA')) : undefined,
		);
		await page.goto('/order/?theme=T01&package=SAT-ISTIMEWA');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();

		await expect(dialog(page).getByRole('button', { name: 'Langsung bayar' })).toBeDisabled();
	});
});

test.describe('payment', () => {
	test('sends the documented order without a price and redirects to the Duitku checkout', async ({ page }) => {
		const calls = await mockPlatform(page);
		await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await dialog(page).getByRole('button', { name: 'Langsung bayar' }).click();

		await expect(page).toHaveURL(DUITKU);
		const order = calls.find((call) => call.path === '/orders');
		expect(order?.body).toEqual({
			application_code: 'SATAMU',
			package_code: 'SAT-SPESIAL',
			customer: { name: 'Sari Lestari', email: 'sari@example.com', phone: '6281234567890' },
			details: { theme_code: 'T01', event_type: 'wedding', event_date: '2027-02-20', notes: 'Adat Jawa' },
		});
		expect(JSON.stringify(order?.body)).not.toMatch(/price|amount|total|currency/i);
		expect(order?.key).toBeTruthy();
		expect(calls.find((call) => call.path === `/orders/${REFERENCE}/checkout`)?.key).toBeTruthy();
	});

	test('a double click creates one order and one checkout request', async ({ page }) => {
		const calls = await mockPlatform(page, (call) => {
			const reply = happyPlatform(call);
			return call.path === '/orders' && reply && reply !== 'abort' ? { ...reply, delayMs: 400 } : reply;
		});
		await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		const pay = dialog(page).getByRole('button', { name: 'Langsung bayar' });
		await pay.dblclick();
		await expect(dialog(page).getByRole('button', { name: 'Menyiapkan pembayaran...' })).toBeDisabled();

		await expect(page).toHaveURL(DUITKU);
		expect(calls.filter((call) => call.path === '/orders')).toHaveLength(1);
		expect(calls.filter((call) => call.path.endsWith('/checkout'))).toHaveLength(1);
	});

	test('a retry after a failure replays the same order key instead of creating a second order', async ({ page }) => {
		let checkouts = 0;
		const calls = await mockPlatform(page, (call) => {
			if (call.path.endsWith('/checkout') && ++checkouts === 1) return fail('GATEWAY_UNAVAILABLE', 502);
			return happyPlatform(call);
		});
		await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await dialog(page).getByRole('button', { name: 'Langsung bayar' }).click();

		await expect(dialog(page).getByRole('alert')).toContainText('Pembayaran belum dapat dibuat');
		await dialog(page).getByRole('button', { name: 'Langsung bayar' }).click();
		await expect(page).toHaveURL(DUITKU);

		const orderKeys = calls.filter((call) => call.path === '/orders').map((call) => call.key);
		expect(orderKeys).toHaveLength(2);
		expect(orderKeys[0]).toBe(orderKeys[1]);
	});

	test('the same intent after a reload keeps its idempotency keys', async ({ page }) => {
		const calls = await mockPlatform(page, (call) =>
			call.path.endsWith('/checkout') ? fail('CHECKOUT_IN_PROGRESS', 409) : happyPlatform(call),
		);
		for (let visit = 0; visit < 2; visit++) {
			await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
			await fillOrder(page);
			await page.getByRole('button', { name: 'Lanjutkan' }).click();
			await dialog(page).getByRole('button', { name: 'Langsung bayar' }).click();
			await expect(dialog(page).getByRole('alert')).toContainText('Pembayaran sedang disiapkan');
		}

		const orderKeys = new Set(calls.filter((call) => call.path === '/orders').map((call) => call.key));
		expect(orderKeys.size).toBe(1);
		const stored = await page.evaluate(() => JSON.stringify(sessionStorage));
		expect(stored).not.toContain('sari');
		expect(stored).not.toContain('Sari');
		expect(stored).not.toContain('6281234567890');
	});

	test('never follows a checkout URL that is not HTTPS', async ({ page }) => {
		await mockPlatform(page, (call) =>
			call.path.endsWith('/checkout') ? ok({ checkout_url: 'http://evil.example/pay' }, 201) : happyPlatform(call),
		);
		await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
		await fillOrder(page);
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await dialog(page).getByRole('button', { name: 'Langsung bayar' }).click();

		await expect(dialog(page).getByRole('alert')).toContainText('Pembayaran belum dapat dibuat');
		await expect(page).toHaveURL(/\/order\//);
	});
});
