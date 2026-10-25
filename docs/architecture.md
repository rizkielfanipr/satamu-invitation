# Arsitektur

## Sekarang

Website statis Astro dengan halaman home (`/`) dan katalog tema (`/themes/`):

- **Header** (`SiteHeader`): transparan di atas halaman; setelah di-scroll (`data-scrolled`, diatur `src/scripts/header.ts`) berubah menjadi bar mengambang dengan border, latar dan sudut membulat. Menu: Koleksi Tema, Paket, Tanya Jawab, serta tombol **Order Sekarang**. Di layar kecil menu memakai `<details>` tanpa JavaScript.
- **Hero** (`HeroSection`): judul, blok harga ("Mulai dari" + harga paket termurah dari `packages.items[0]`), satu tombol **Buat Undangan Sekarang**, timeline 3 langkah (Temukan gaya kalian → Ceritakan momenmu → Sebar kabar bahagia), dan ilustrasi tiga ponsel undangan (`PhoneMockup`) dengan kartu "Undangan terkirim" (tautan pribadi lewat WhatsApp). Satamu tidak menyediakan konfirmasi kehadiran (RSVP), jadi jangan menjanjikannya di copy.
- Tombol Order dan Buat Undangan membuka WhatsApp dengan pesan siap kirim (sampai form order dan API tersedia).
- **Koleksi Tema** (`ThemesSection`, `#themes`): `SectionIntro`, filter kategori dan 12 tema (`ThemeGrid` dengan `limit`, 6 per baris di desktop), lalu tombol **Lihat Semua Template** ke `/themes/`. Kartu (`ThemeCard`) berisi frame HP (`PhoneMockup size="sm"` dengan warna dari data), kategori, nama tema dan tautan **Pakai template ini →**.
- **Katalog** (`/themes/`, `ThemeCatalogPage`): semua tema dengan filter yang sama; `?category=<key>` memilih filter (`src/scripts/theme-filter.ts`). Header di halaman ini mengarahkan menu ke `/#…` (`SiteHeader onHome={false}`).
- Data tema: `src/data/themes.ts` (18 tema **dummy**, kode `T01`… permanen, kategori `elegant`, `floral`, `modern`, `minimal`, `rustic`; labelnya di `themes.categories` pada `content.ts`). Tautan **Pakai template ini** di kartu membuka WhatsApp dengan pesan pesanan berisi nama dan kode tema.
- **Paket** (`PricingSection`, `#packages`): tiga kartu harga dari `packages.items` di `content.ts` (Sederhana Rp49.000, Spesial Rp79.000 sebagai *Paling diminati*, Istimewa Rp149.000). Isi paket masih **dummy**. Tombol **Pilih Paket** membuka WhatsApp dengan nama dan harga paket. Harga "Mulai dari" di hero diambil dari paket pertama (termurah), jadi urutan `items` harus dari yang termurah.
- **Tanya Jawab** (`FaqSection`, `#faq`): `SectionIntro` dan accordion `<details>` (tanpa JavaScript) dari `faq.items` di `content.ts`.
- **Footer** (`SiteFooter`): gelap seperti Prasetya Webworks: logo putih (`site.logoOnDark`), tagline, ikon sosial media (Font Awesome brands, `site.social` masih placeholder), menu yang sama dengan header, kontak WhatsApp dan tautan ke Prasetya Webworks, lalu baris hak cipta dan "Kembali ke atas".
- Semua tautan menu sudah punya section tujuan. Menu Keistimewaan (`#features`) dihapus sampai section-nya dibuat. Push ke `main` di-deploy otomatis ke cPanel (lihat [deployment.md](deployment.md)).

Gaya memakai Tailwind CSS v4 dan komponen shadcn/ui (React). Komponen React tanpa `client:*` dirender menjadi HTML saat build, jadi halaman tetap tanpa JavaScript. Warna tema shadcn diambil dari logo Satamu di `src/styles/global.css`. Lihat [ADR 0002](decisions/0002-tailwind-shadcn.md). Bahasa visual (warna, tipografi, spacing, komponen) ada di [design.md](design.md).

## Rencana

```text
satamu.prasetyawebworks.web.id   (repo ini, Astro)   landing, katalog tema, form order
            │ API (/api/v1/...)
            ▼
Laravel + admin panel (repo terpisah)                order, pembayaran, pelanggan, status undangan
            │ setelah lunas: buat undangan (manual dulu, nanti otomatis)
            ▼
WordPress Multisite khusus undangan                  1 subsite = 1 undangan pelanggan (tema, nama tamu ?to=)
```

Tahapan:

1. Landing lengkap: tema, fitur, paket dan harga, FAQ, pesan lewat WhatsApp (seperti Prasetya Webworks).
2. Form order mengirim ke API Laravel, lalu pembayaran lewat payment gateway.
3. Undangan dibuat manual dari admin panel, kemudian otomatis (plugin WordPress atau WP-CLI).

## Belum diputuskan

- Alamat undangan pelanggan: subdomain Prasetya (misalnya `undangan.prasetyawebworks.web.id/<slug>`) atau domain Satamu sendiri.
- Apakah pelanggan boleh mengedit undangannya sendiri.
- Payment gateway (Midtrans, Xendit, Tripay, Duitku, …).
- Jenis acara, paket dan harga undangan.
- Kontras warna coral untuk teks kecil dan tombol (lihat Known gaps di [design.md](design.md)).
- Wordmark di `satamu-logo-flat.svg` masih memakai teks sistem (Avenir Next); perlu diubah menjadi path seperti logo Prasetya agar tampil sama di semua perangkat.
