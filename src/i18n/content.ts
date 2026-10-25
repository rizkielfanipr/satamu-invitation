/**
 * All visible text. Indonesian only for now; add an `en` object with the same keys when an English site is needed.
 * Placeholders such as {site} are filled with `.replace()` in the component.
 */
export const content = {
	id: {
		meta: {
			title: 'Satamu - Undangan Digital untuk Momen Berhargamu',
			description: 'Satamu menghadirkan undangan digital yang elegan, mudah dibagikan, dan lengkap dengan RSVP. Segera hadir.',
		},
		hero: {
			eyebrow: 'Undangan digital',
			title: 'Undangan digital',
			emphasis: 'untuk momen berhargamu.',
			description: 'Satamu sedang disiapkan. Sementara itu, tanyakan tema dan harga undangan langsung lewat WhatsApp.',
			primary: 'Tanya via WhatsApp',
			message: 'Halo {site}, saya ingin bertanya tentang undangan digital.',
			soon: 'Segera hadir',
		},
		footer: {
			by: 'Satamu adalah produk dari',
			rights: 'Seluruh hak dilindungi.',
		},
	},
} as const;

export type Locale = keyof typeof content;
