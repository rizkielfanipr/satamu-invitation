# ADR 0003 — Metadata SEO, pratinjau tautan dan favicon

## Status

Accepted — 25 Oktober 2026

## Konteks

Satamu perlu muncul di Google dengan judul yang menyebut layanan dan induk brand ("Satamu by Prasetya Webworks - Jasa Bikin Undangan Website Digital"), dan tampil rapi saat tautannya dibagikan di WhatsApp atau media sosial. Polanya mengikuti ADR 0011 di prasetya-webworks.

## Keputusan

- Judul dan deskripsi home ada di `meta` pada `src/i18n/content.ts`; halaman katalog memakai `catalog.metaTitle` dan `catalog.metaDescription`.
- `Layout.astro` merender canonical, Open Graph (`og:image` 1200×630 dari `site.ogImage`), Twitter card, dan favicon.
- Favicon (`favicon.svg`, `favicon.png`, `favicon.ico`, `apple-touch-icon.png`) dibuat dari simbol logo Satamu di atas petak krem.
- Home menyertakan JSON-LD `WebSite` dan `ProfessionalService` (nama "Satamu by Prasetya Webworks", telepon WhatsApp, `parentOrganization` Prasetya Webworks, dan paket sebagai `Offer` IDR) lewat prop `structuredData` di `Layout`.
- `public/robots.txt` menunjuk ke `sitemap-index.xml` dari `@astrojs/sitemap`.

## Konsekuensi

- ✅ Judul, deskripsi dan pratinjau tautan diatur dari `content.ts`.
- ⚠️ `public/images/og-image.png` dibuat manual; buat ulang kalau harga, judul hero atau logo berubah.
- ⚠️ Kalau domain Satamu berubah, ganti `site` di `astro.config.mjs` dan baris `Sitemap:` di `public/robots.txt`.
- ⚠️ Peringkat di Google tetap bergantung pada Google Search Console, konten dan backlink.
