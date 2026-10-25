# ADR 0001 — Satamu sebagai repo dan website Astro terpisah

## Status

Accepted — 25 Oktober 2026

## Konteks

Satamu (undangan digital) punya pembeli, nada bahasa, produk dan alur yang berbeda dari Prasetya Webworks (website bisnis). Menggabungkan keduanya di satu website akan mencampur pesan dan sinyal SEO.

## Keputusan

- Satamu menjadi repo sendiri (`satamu-invitation`) di folder induk `prasetya-group/`, berdampingan dengan `prasetya-webworks`.
- Landing memakai Astro statis dengan tooling dan konvensi yang sama (Prettier, ESLint, Stylelint, `astro check`).
- Target production: `satamu.prasetyawebworks.web.id`. Logo menyatakan hubungan brand ("by prasetya webworks"), dan footer menautkan ke Prasetya Webworks.
- Order, pembayaran dan admin akan ditangani backend Laravel bersama; undangan pelanggan dirender WordPress Multisite tersendiri (lihat `../../README.md`).

## Konsekuensi

- ✅ Brand, desain dan rilis Satamu tidak bergantung pada Prasetya Webworks.
- ⚠️ Konvensi kode perlu dijaga sama secara manual di kedua repo.
- ✅ Deploy otomatis ke subdomain di cPanel memakai pola dan deploy key yang sama dengan prasetya-webworks.
