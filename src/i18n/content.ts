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
			selectLabel: 'Pilih paket {name}',
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
						'Pilih tema dan paket, lalu isi form pesanan dengan data acaramu. Setelah itu kamu bisa konsultasi dulu dengan tim Satamu lewat WhatsApp, atau langsung membayar jika pembayaran online tersedia.',
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
		order: {
			metaTitle: 'Pesan Undangan Digital - Satamu by Prasetya Webworks',
			metaDescription: 'Pilih tema dan paket, isi data acara, lalu konsultasi lewat WhatsApp atau bayar langsung.',
			eyebrow: 'Pesan undangan',
			title: 'Ceritakan',
			emphasis: 'acaramu.',
			description: 'Isi data singkat di bawah ini. Detail lengkap seperti nama mempelai, lokasi, dan foto kami minta setelahnya.',
			form: 'Form pesanan undangan',
			sections: { choice: 'Tema dan paket', contact: 'Data pemesan', event: 'Data acara' },
			fields: {
				theme: 'Tema',
				themePlaceholder: 'Pilih tema',
				themeOption: '{name} ({code})',
				package: 'Paket',
				packagePlaceholder: 'Pilih paket',
				name: 'Nama lengkap',
				email: 'Email',
				emailHint: 'Untuk konfirmasi pesanan dan bukti pembayaran.',
				whatsapp: 'Nomor WhatsApp',
				whatsappHint: 'Contoh: 0812 3456 7890.',
				eventType: 'Jenis acara',
				eventTypePlaceholder: 'Pilih jenis acara',
				eventDate: 'Tanggal acara',
				notes: 'Catatan',
				optional: '(opsional)',
				notesHint: 'Misalnya adat, warna favorit, atau pertanyaan untuk tim kami.',
				consent: 'Saya menyetujui {link} Satamu dan mengizinkan data pesanan ini disimpan untuk memproses undangan.',
				consentLink: 'ketentuan dan kebijakan privasi',
			},
			// Codes are in src/data/event-types.ts.
			eventTypes: {
				wedding: 'Pernikahan',
				engagement: 'Lamaran atau tunangan',
				aqiqah: 'Aqiqah',
				khitan: 'Khitanan',
				birthday: 'Ulang tahun',
				other: 'Acara lainnya',
			},
			errors: {
				summary: 'Ada {count} isian yang perlu diperiksa.',
				theme: 'Pilih tema undangan.',
				package: 'Pilih paket.',
				name: 'Isi nama lengkap.',
				nameLong: 'Nama terlalu panjang, maksimal 255 karakter.',
				email: 'Isi email.',
				emailInvalid: 'Format email belum benar, misalnya nama@contoh.com.',
				whatsapp: 'Isi nomor WhatsApp.',
				whatsappInvalid: 'Nomor WhatsApp belum benar. Gunakan nomor Indonesia yang diawali 08 atau 62.',
				eventType: 'Pilih jenis acara.',
				eventDate: 'Isi tanggal acara.',
				eventDateInvalid: 'Tanggal acara belum benar.',
				eventDatePast: 'Tanggal acara tidak boleh sebelum hari ini.',
				notesLong: 'Catatan terlalu panjang, maksimal 2.000 karakter.',
				consent: 'Setujui ketentuan dan kebijakan privasi untuk melanjutkan.',
			},
			submit: 'Lanjutkan',
			dialog: {
				title: 'Ringkasan pesanan',
				description: 'Periksa pesananmu, lalu pilih cara melanjutkan.',
				close: 'Tutup',
				theme: 'Tema',
				package: 'Paket',
				event: 'Acara',
				price: 'Harga',
				priceLoading: 'Mengambil harga...',
				priceUnavailable: 'Harga belum dapat dimuat',
				priceSource: 'Harga diambil langsung dari sistem pembayaran Satamu.',
				workStarts: 'Pengerjaan dimulai setelah pembayaran diterima dan materi undangan lengkap.',
				gateway:
					'Pembayaran diproses oleh Duitku. Kembali dari halaman pembayaran belum tentu berarti pembayaran berhasil; status pesanan akan kami tampilkan.',
				consultHint: 'Masih ragu? Konsultasi lewat WhatsApp tetap tersedia, gratis.',
				offline: 'Pembayaran online belum tersedia. Lanjutkan pesananmu lewat WhatsApp.',
				payUnavailable: 'Pembayaran online sedang tidak tersedia. Kamu tetap bisa konsultasi lewat WhatsApp.',
				consult: 'Konsultasi dulu',
				pay: 'Langsung bayar',
				paying: 'Menyiapkan pembayaran...',
				failures: {
					invalid: 'Data pesanan belum diterima. Periksa kembali isian form.',
					busy: 'Pembayaran sedang disiapkan. Tunggu sebentar, lalu coba lagi.',
					unavailable: 'Pembayaran belum dapat dibuat. Coba lagi, atau konsultasi lewat WhatsApp.',
				},
			},
			// Sent to WhatsApp. No email or phone: the chat already shows who is writing.
			whatsapp: {
				intro: 'Halo {site}, saya ingin konsultasi pesanan undangan:',
				theme: 'Tema: {value}',
				package: 'Paket: {value}',
				event: 'Acara: {value}',
				notes: 'Catatan: {value}',
			},
		},
		orderStatus: {
			metaTitle: 'Status Pesanan - Satamu by Prasetya Webworks',
			metaDescription: 'Status pembayaran pesanan undangan digital Satamu.',
			eyebrow: 'Status pesanan',
			title: 'Status',
			emphasis: 'pembayaranmu.',
			invoice: 'Nomor pesanan',
			views: {
				loading: { title: 'Memeriksa status pembayaran...', description: 'Mohon tunggu sebentar.' },
				paid: {
					title: 'Pembayaran diterima',
					description: 'Terima kasih! Tim Satamu akan menghubungimu lewat WhatsApp untuk meminta materi undangan, lalu mulai merangkainya.',
				},
				pending: {
					title: 'Menunggu pembayaran',
					description: 'Pembayaranmu belum kami terima. Jika sudah membayar, status akan diperbarui otomatis dalam beberapa saat.',
				},
				retry: {
					title: 'Pembayaran belum selesai',
					description: 'Pembayaran sebelumnya tidak selesai atau sudah kedaluwarsa. Kamu bisa mencoba membayar lagi.',
				},
				closed: {
					title: 'Pesanan ditutup',
					description: 'Pesanan ini sudah tidak dapat dibayar. Hubungi kami jika butuh bantuan atau ingin memesan lagi.',
				},
				invalid: {
					title: 'Pesanan tidak ditemukan',
					description: 'Tautan status ini tidak valid. Buka kembali tautan dari halaman pembayaran, atau hubungi kami.',
				},
				unavailable: {
					title: 'Status belum dapat dimuat',
					description: 'Layanan pembayaran sedang tidak dapat dihubungi. Coba lagi beberapa saat lagi.',
				},
			},
			resume: 'Lanjutkan pembayaran',
			retry: 'Coba bayar lagi',
			retrying: 'Menyiapkan pembayaran...',
			retryFailed: 'Pembayaran belum dapat dibuat. Coba lagi sebentar lagi, atau hubungi kami.',
			refresh: 'Perbarui status',
			newOrder: 'Buat pesanan baru',
			home: 'Kembali ke beranda',
			help: 'Butuh bantuan? Chat WhatsApp',
			helpMessage: 'Halo {site}, saya butuh bantuan untuk pesanan {invoice}.',
			helpMessageGeneric: 'Halo {site}, saya butuh bantuan untuk pesanan undangan saya.',
		},
		privacy: {
			metaTitle: 'Ketentuan dan Kebijakan Privasi - Satamu by Prasetya Webworks',
			metaDescription: 'Ketentuan pemesanan dan cara Satamu menyimpan data pesanan undangan digital.',
			eyebrow: 'Ketentuan',
			title: 'Ketentuan dan',
			emphasis: 'kebijakan privasi.',
			// DRAFT: must be approved by the business before online payment is switched on (docs/payment-checkout-plan.md).
			sections: [
				{
					title: 'Data yang kami simpan',
					body: [
						'Saat kamu memesan, kami menyimpan nama, email, nomor WhatsApp, tema, paket, jenis dan tanggal acara, serta catatan yang kamu tulis.',
						'Data disimpan di Prasetya Platform, sistem pesanan milik Prasetya Webworks, dan hanya dipakai untuk memproses pesanan, pembayaran, dan undanganmu.',
					],
				},
				{
					title: 'Pembayaran',
					body: [
						'Pembayaran online diproses oleh Duitku. Satamu tidak menerima maupun menyimpan data kartu atau rekeningmu.',
						'Status pembayaran hanya dianggap lunas setelah dikonfirmasi oleh sistem pembayaran, bukan dari halaman yang terbuka setelah kamu membayar.',
					],
				},
				{
					title: 'Pengerjaan undangan',
					body: [
						'Pengerjaan dimulai setelah pembayaran diterima dan materi undangan lengkap. Tim kami menghubungimu lewat WhatsApp untuk meminta materi tersebut.',
						'Pembatalan dan pengembalian dana dibicarakan langsung dengan tim Satamu lewat WhatsApp.',
					],
				},
				{
					title: 'Hak atas datamu',
					body: [
						'Kamu dapat meminta salinan, perbaikan, atau penghapusan data pesananmu dengan menghubungi kami lewat WhatsApp. Catatan transaksi yang wajib disimpan untuk keperluan pembukuan tetap kami simpan.',
					],
				},
			],
			contact: 'Hubungi kami lewat WhatsApp',
		},
		footer: {
			tagline: 'Undangan digital yang menyapa setiap tamu dengan namanya. Dirangkai dengan rapi, dikirim lewat WhatsApp.',
			menu: 'Menu',
			contact: 'Hubungi Kami',
			message: 'Halo {site}, saya ingin membuat undangan digital untuk acara saya.',
			location: 'Indonesia',
			social: 'Satamu di {network}',
			by: 'Satamu dipersembahkan oleh',
			rights: 'Hak cipta dilindungi.',
			back: 'Kembali ke atas',
			privacy: 'Ketentuan dan privasi',
		},
	},
} as const;

export type Locale = keyof typeof content;
