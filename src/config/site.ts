/** Site-wide constants. Change them here instead of searching the components. */
export const site = {
	name: 'Satamu',
	/** WhatsApp number for orders and questions, international format without "+". */
	whatsapp: '628995449805',
	logo: '/images/satamu-logo-flat.svg',
	/** White-text version for dark backgrounds such as the footer. */
	logoOnDark: '/images/satamu-logo-white.svg',
	/** 1200×630 preview image for search results and shared links (Open Graph). */
	ogImage: '/images/og-image.png',
	/** Social profiles shown in the footer, in this order. Placeholders: replace with the real Satamu profile URLs. */
	social: [
		{ network: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/' },
		{ network: 'TikTok', icon: 'fa-tiktok', url: 'https://www.tiktok.com/' },
		{ network: 'Facebook', icon: 'fa-facebook-f', url: 'https://www.facebook.com/' },
	],
	/** Satamu is a product of Prasetya Webworks ("by prasetya webworks" in the logo). */
	parent: { name: 'Prasetya Webworks', url: 'https://prasetyawebworks.web.id' },
	/**
	 * Prasetya Platform API origin, read at build time from PUBLIC_PLATFORM_API_URL (for example
	 * https://platform.prasetyawebworks.web.id). Empty turns online payment off: the order form then offers
	 * WhatsApp consultation only. The platform owns prices and payment status; see ADR 0004.
	 */
	platformApiUrl: ((import.meta.env.PUBLIC_PLATFORM_API_URL ?? '') as string).trim().replace(/\/+$/, ''),
} as const;

/** Whether this build offers "Langsung bayar". */
export const onlinePayment = site.platformApiUrl !== '';
