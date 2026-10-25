/**
 * All visible text. Indonesian only for now; add an `en` object with the same keys when an English site is needed.
 * Placeholders such as {site} are filled with `.replace()` in the component.
 */
export const content = {
	id: {
		meta: {
			title: 'Satamu by Prasetya Webworks - Jasa Bikin Undangan Website Digital',
			description:
				'Jasa bikin undangan website digital mulai Rp49.000. Pilih tema, kirim detail acara, dan bagikan undangan dengan nama tiap tamu di sampulnya lewat WhatsApp.',
			imageAlt: 'Satamu - undangan digital mulai Rp49.000',
		},
		nav: {
			label: 'Navigasi utama',
			menu: 'Buka menu',
			home: 'Satamu, kembali ke atas',
			// Anchors of the home sections, in page order.
			links: [
				{ label: 'Koleksi Tema', hash: '#themes' },
				{ label: 'Paket', hash: '#packages' },
				{ label: 'Tanya Jawab', hash: '#faq' },
			],
			order: 'Order Sekarang',
		},
		hero: {
			// Rendered as: "Undangan digital," (semibold) "terasa personal" (italic) "untuk setiap tamu." (semibold italic, coral). Max 3 lines.
			lead: 'Undangan digital,',
			connector: 'terasa personal',
			emphasis: 'untuk setiap tamu.',
			// Price block below the heading, as on Prasetya Webworks: "MULAI DARI  Rp49.000  Undangan siap dibagikan".
			// The price itself is the cheapest package (packages.items[0].price), so hero and pricing never disagree.
			pricePrefix: 'Mulai dari',
			priceSuffix: 'Undangan siap dibagikan',
			primary: 'Buat Undangan Sekarang',
			message: 'Halo {site}, saya ingin membuat undangan digital untuk acara saya.',
			stepsLabel: 'Tiga langkah menuju undanganmu',
			steps: [
				{ title: 'Temukan gaya kalian', description: 'Jelajahi koleksi tema, dari yang klasik dan anggun hingga yang ceria.' },
				{ title: 'Ceritakan momenmu', description: 'Kirim nama, jadwal, lokasi, dan foto favorit. Tim kami yang merangkainya.' },
				{ title: 'Sebar kabar bahagia', description: 'Setiap tamu menerima tautan dengan namanya sendiri, langsung ke WhatsApp mereka.' },
			],
			// Illustrative content inside the phone mockups (decorative, hidden from screen readers).
			mockup: {
				label: 'Pernikahan',
				main: { first: 'Nayla', second: 'Fikri', date: 'Sabtu, 6 Maret 2027' },
				left: { first: 'Citra', second: 'Galih', date: '17 April 2027' },
				right: { first: 'Maharani', second: 'Yoga', date: '9 Januari 2027' },
				to: 'Teruntuk',
				guest: 'Ibu Ratna & keluarga',
				open: 'Lihat Undangan',
				sentTitle: 'Undangan terkirim',
				sentName: 'Ibu Ratna & keluarga',
				sentDetail: 'Tautan pribadi lewat WhatsApp',
			},
		},
		themes: {
			eyebrow: 'Koleksi tema',
			title: 'Pilih tema yang',
			emphasis: 'paling kalian banget.',
			description: 'Setiap tema kami sesuaikan dengan nama, foto, warna, dan susunan acaramu sebelum dikirim ke tamu.',
			filterLabel: 'Filter tema berdasarkan gaya',
			all: 'Semua',
			// Category keys are used in URLs (?category=floral), so they stay English and lowercase.
			categories: {
				elegant: 'Elegan',
				floral: 'Floral',
				modern: 'Modern',
				minimal: 'Minimalis',
				rustic: 'Rustik',
			},
			coverLabel: 'Pernikahan',
			use: 'Pakai template ini',
			useLabel: 'Pakai template {name}',
			useMessage: 'Halo {site}, saya ingin memakai tema {name} (#{code}) untuk undangan saya.',
			viewAll: 'Lihat Semua Template',
		},
		packages: {
			eyebrow: 'Paket',
			title: 'Harga jelas,',
			emphasis: 'tanpa biaya tersembunyi.',
			description: 'Sekali bayar untuk satu acara. Pilih paket yang pas, tim Satamu yang merangkai undanganmu.',
			popular: 'Paling diminati',
			perEvent: '/ acara',
			select: 'Pilih Paket',
			selectMessage: 'Halo {site}, saya ingin memesan paket {name} ({price}).',
			note: 'Masa aktif dihitung sejak undangan pertama kali dibagikan ke tamu.',
			// Dummy contents until the real packages are decided. Cheapest first: the hero shows items[0].price.
			items: [
				{
					name: 'Sederhana',
					price: 'Rp49.000',
					tagline: 'Untuk acara kecil yang tetap ingin tampil rapi.',
					features: ['1 tema pilihan', 'Nama tamu di sampul undangan', 'Peta lokasi acara', 'Galeri hingga 5 foto', 'Masa aktif 1 bulan'],
				},
				{
					name: 'Spesial',
					price: 'Rp79.000',
					tagline: 'Pilihan favorit untuk lamaran dan pernikahan.',
					features: [
						'Semua isi paket Sederhana',
						'Galeri hingga 15 foto',
						'Musik latar',
						'Hitung mundur acara',
						'Revisi 2x',
						'Masa aktif 3 bulan',
					],
					popular: true,
				},
				{
					name: 'Istimewa',
					price: 'Rp149.000',
					tagline: 'Untuk acara besar dengan cerita yang lebih lengkap.',
					features: [
						'Semua isi paket Spesial',
						'Galeri hingga 30 foto dan video',
						'Cerita perjalanan kalian',
						'Amplop digital',
						'Revisi 5x',
						'Masa aktif 12 bulan',
					],
				},
			],
		},
		catalog: {
			metaTitle: 'Koleksi Tema Undangan Digital - Satamu by Prasetya Webworks',
			metaDescription:
				'Semua tema undangan digital Satamu: elegan, floral, modern, minimalis, dan rustik. Pilih temanya, kami sesuaikan dengan acaramu.',
			title: 'Semua',
			emphasis: 'koleksi tema.',
		},
		faq: {
			eyebrow: 'Tanya jawab',
			title: 'Masih ada yang',
			emphasis: 'ingin ditanyakan?',
			description: 'Jawaban singkat seputar cara pesan, isi undangan, dan pengiriman ke tamu.',
			items: [
				{
					question: 'Bagaimana cara memesan undangan di Satamu?',
					answer:
						'Pilih tema dan paket, lalu tekan tombol pesan. Kamu akan terhubung ke WhatsApp tim Satamu untuk mengirim detail acara dan menerima info pembayaran.',
				},
				{
					question: 'Berapa lama undanganku selesai dibuat?',
					answer:
						'Kami mulai merangkai undangan setelah data acara lengkap dan pembayaran diterima. Perkiraan waktunya kami sampaikan saat pesananmu dikonfirmasi.',
				},
				{
					question: 'Apakah nama tamu bisa berbeda untuk setiap orang?',
					answer:
						'Bisa. Setiap tamu menerima tautan dengan namanya sendiri di sampul undangan, jadi undangan terasa lebih personal saat dibuka.',
				},
				{
					question: 'Bisakah isi undangan diubah setelah jadi?',
					answer: 'Bisa, sesuai jumlah revisi di paket yang kamu pilih. Perubahan di luar itu bisa dibicarakan lewat WhatsApp.',
				},
				{
					question: 'Apakah tamu perlu memasang aplikasi?',
					answer: 'Tidak perlu. Undangan dibuka langsung dari browser di HP mana pun, cukup dengan menekan tautan yang kamu kirim.',
				},
				{
					question: 'Berapa lama undangan bisa diakses?',
					answer: 'Undangan aktif sesuai masa aktif paketmu, dihitung sejak undangan pertama kali dibagikan ke tamu.',
				},
			],
		},
		footer: {
			tagline: 'Undangan digital yang menyapa setiap tamu dengan namanya. Dirangkai dengan rapi, dikirim lewat WhatsApp.',
			menu: 'Menu',
			contact: 'Hubungi Kami',
			location: 'Indonesia',
			social: 'Satamu di {network}',
			by: 'Satamu dipersembahkan oleh',
			rights: 'Hak cipta dilindungi.',
			back: 'Kembali ke atas',
		},
	},
} as const;

export type Locale = keyof typeof content;
