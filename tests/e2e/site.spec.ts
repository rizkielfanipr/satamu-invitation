import AxeBuilder from '@axe-core/playwright';
import { REFERENCE, dialog, expect, fillOrder, horizontalOverflow, mockPlatform, status, test } from './support';

const pages = ['/', '/themes/', '/order/', `/order/status/?order=${REFERENCE}`, '/privacy/'];
const viewports = [
	{ name: 'mobile', width: 360, height: 780 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 900 },
];

test.beforeEach(async ({ page }) => {
	await mockPlatform(page, (call) => (call.path.endsWith('/payment-status') ? status('PENDING_PAYMENT', 'PENDING') : undefined));
});

test('home and catalog still work: sections, theme filter, and catalog links', async ({ page }) => {
	await page.goto('/');
	for (const id of ['themes', 'packages', 'faq']) await expect(page.locator(`#${id}`)).toBeVisible();
	await expect(page.locator('[data-theme-card]:visible')).toHaveCount(12);
	await page.locator('#themes').getByRole('button', { name: 'Floral' }).click();
	await expect(page.locator('#themes [data-theme-card]:visible').first()).toHaveAttribute('data-category', 'floral');
	await expect(page.getByRole('link', { name: 'Pilih paket Spesial' })).toHaveAttribute('href', '/order/?package=SAT-SPESIAL');
	await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Ketentuan dan privasi' })).toHaveAttribute('href', '/privacy/');

	await page.goto('/themes/?category=rustic');
	await expect(page.locator('[data-theme-card]:visible').first()).toHaveAttribute('data-category', 'rustic');
	await expect(page.getByRole('link', { name: 'Pakai template ini Sabana' })).toHaveAttribute('href', '/order/?theme=T05');
});

for (const viewport of viewports) {
	test(`no horizontal scroll on ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
		await page.setViewportSize(viewport);
		for (const path of pages) {
			await page.goto(path);
			expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(0);
		}

		await page.goto('/order/');
		await fillOrder(page, { theme: 'T18', package: 'SAT-ISTIMEWA' });
		await page.getByRole('button', { name: 'Lanjutkan' }).click();
		await expect(dialog(page)).toBeVisible();
		const box = await dialog(page).boundingBox();
		expect(box && box.x >= 0 && box.x + box.width <= viewport.width).toBe(true);
		expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
	});
}

// Coral contrast is a known, documented gap (docs/design.md, "Known gaps") that predates this page; every other rule runs.
const axe = (page: import('@playwright/test').Page) =>
	new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).disableRules(['color-contrast']);

for (const path of pages) {
	test(`no accessibility violations on ${path}`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('main')).toBeVisible();
		expect((await axe(page).analyze()).violations).toEqual([]);
	});
}

test('no accessibility violations with errors shown and with the dialog open', async ({ page }) => {
	await mockPlatform(page); // Later routes win: the full platform, with the catalogue.
	await page.goto('/order/');
	await page.getByRole('button', { name: 'Lanjutkan' }).click();
	expect((await axe(page).analyze()).violations).toEqual([]);

	await fillOrder(page, { theme: 'T01', package: 'SAT-SPESIAL' });
	await page.getByRole('button', { name: 'Lanjutkan' }).click();
	await expect(dialog(page)).toContainText('Rp85.000');
	expect((await axe(page).analyze()).violations).toEqual([]);
});

test('the order form works with the keyboard alone', async ({ page }) => {
	await page.goto('/order/?theme=T01&package=SAT-SPESIAL');
	await fillOrder(page);
	await page.getByRole('button', { name: 'Lanjutkan' }).focus();
	await page.keyboard.press('Enter');
	await expect(dialog(page).getByRole('heading', { name: 'Ringkasan pesanan' })).toBeFocused();

	// Tab stays inside the modal: the page behind it is inert.
	for (let i = 0; i < 6; i++) {
		await page.keyboard.press('Tab');
		const inside = await page.evaluate(() => document.querySelector('dialog')?.contains(document.activeElement) ?? false);
		const onBody = await page.evaluate(() => document.activeElement === document.body);
		expect(inside || onBody).toBe(true);
	}
	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: 'Lanjutkan' })).toBeFocused();
});
