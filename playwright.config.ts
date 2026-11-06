import { defineConfig, devices } from '@playwright/test';

// The site is built with a platform URL that only exists inside the tests: tests/e2e/support.ts answers it with
// page.route, so no test reaches Prasetya Platform, Duitku, or WhatsApp.
export const PLATFORM = 'https://platform.test';
const PORT = 4329;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['list']] : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
		reducedMotion: 'reduce',
		locale: 'id-ID',
		timezoneId: 'Asia/Jakarta',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `npm run build && npx astro preview --port ${PORT} --ignore-lock`,
		url: `http://localhost:${PORT}`,
		env: { PUBLIC_PLATFORM_API_URL: PLATFORM },
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
