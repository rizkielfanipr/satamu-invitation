/** Site-wide constants. Change them here instead of searching the components. */
export const site = {
	name: 'Satamu',
	/** WhatsApp number for orders and questions, international format without "+". */
	whatsapp: '628995449805',
	logo: '/images/satamu-logo-flat.svg',
	/** White-text version for dark backgrounds such as the footer. */
	logoOnDark: '/images/satamu-logo-white.svg',
	/** Social profiles shown in the footer, in this order. Placeholders: replace with the real Satamu profile URLs. */
	social: [
		{ network: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/' },
		{ network: 'TikTok', icon: 'fa-tiktok', url: 'https://www.tiktok.com/' },
		{ network: 'Facebook', icon: 'fa-facebook-f', url: 'https://www.facebook.com/' },
	],
	/** Satamu is a product of Prasetya Webworks ("by prasetya webworks" in the logo). */
	parent: { name: 'Prasetya Webworks', url: 'https://prasetyawebworks.web.id' },
} as const;
