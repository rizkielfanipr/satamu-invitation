/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Astro's Vite config, so the @/ alias and import.meta.env behave as in the build. happy-dom provides
// sessionStorage and Web Crypto for src/scripts.
export default getViteConfig({
	test: {
		environment: 'happy-dom',
		include: ['tests/unit/**/*.test.ts'],
		restoreMocks: true,
		unstubGlobals: true,
	},
});
