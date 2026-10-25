// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// Production URL: used for canonical links, Open Graph URLs and the sitemap.
	site: 'https://satamu.prasetyawebworks.web.id',
	// React renders shadcn/ui components; without a client:* directive they ship as plain HTML, no JavaScript.
	integrations: [react(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
