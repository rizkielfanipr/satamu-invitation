# ADR 0005 — Unit test dan browser test

## Status

Accepted — 6 November 2026

## Konteks

Form order dan pembayaran ([ADR 0004](0004-online-payment-through-platform.md)) membawa logika yang tidak boleh salah: payload tanpa harga, idempotency key, redirect hanya ke checkout yang sah, dan status yang hanya berasal dari Prasetya Platform. `npm run validate` hanya memeriksa format, lint, dan tipe, jadi perilaku ini belum teruji.

## Keputusan

- **Vitest** (`npm test`, `tests/unit/`) untuk fungsi di `src/scripts/`, memakai konfigurasi Vite dari Astro (`getViteConfig`) dan happy-dom untuk `sessionStorage` serta Web Crypto. `fetch` di-stub; tidak ada request jaringan.
- **Playwright** dengan `@axe-core/playwright` (`npm run test:e2e`, `tests/e2e/`). Site dibangun dengan `PUBLIC_PLATFORM_API_URL=https://platform.test`, alamat yang hanya dijawab oleh `page.route` di `tests/e2e/support.ts`. Google Fonts dan halaman Duitku juga di-stub. Test gagal bila ada error di console.
- Versi mengikuti Prasetya Platform (Playwright `~1.64.1`, Vitest `^5`) agar browser yang terpasang sama.
- Aturan axe `color-contrast` dimatikan karena kontras coral sudah tercatat di *Known gaps* pada [design.md](../design.md); semua aturan WCAG 2.1 A/AA lain tetap berjalan.
- CI menjalankan unit test lalu browser test sebelum build deploy. Browser test membangun `dist/` dengan URL palsu, jadi build deploy harus berjalan sesudahnya.

## Konsekuensi

- Perubahan pada form, dialog, atau halaman status harus ikut memperbarui test.
- CI sedikit lebih lama karena memasang Chromium dan membangun site dua kali.
- Kompatibilitas dengan platform dan Duitku yang sebenarnya tetap perlu dicek manual (lihat [deployment.md](../deployment.md)).
