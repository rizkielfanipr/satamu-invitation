# ADR 0002 — Tailwind CSS v4 dan shadcn/ui

## Status

Accepted — 25 Oktober 2026

## Konteks

Prasetya Webworks memakai CSS biasa yang di-scope per komponen dan primitive Astro "bergaya shadcn". Satamu baru berisi satu halaman, jadi ini saat termurah untuk memilih pendekatan lain. Satamu nantinya punya katalog tema, form order dan kemungkinan bagian interaktif, dan pemilik proyek ingin memakai Tailwind serta komponen shadcn/ui yang asli.

## Keputusan

- **Tailwind CSS v4** lewat `@tailwindcss/vite`. Tidak ada `tailwind.config`; tema ditulis di `src/styles/global.css` (`@theme inline`).
- **shadcn/ui** (gaya `new-york`) dengan React (`@astrojs/react`). Komponen disimpan sebagai kode sendiri di `src/components/ui/*.tsx`, konfigurasi di `components.json`, helper `cn()` di `src/lib/utils.ts`, alias `@/*` ke `src/*`.
- Variabel tema shadcn (`--background`, `--primary`, `--muted-foreground`, …) diisi warna logo Satamu: navy `#102A43`, coral `#FF6542`, slate `#526779`, cream `#FFF7F2`.
- Komponen React dirender tanpa `client:*` sehingga keluar sebagai HTML statis. Tautan dan tombol sederhana memakai `<a>` dengan `buttonVariants()`. `client:*` hanya untuk komponen yang benar-benar butuh state di browser.
- Tooling tetap sama dengan prasetya-webworks (Prettier, ESLint, Stylelint, `astro check`), ditambah `prettier-plugin-tailwindcss` untuk mengurutkan class. Stylelint mengenali at-rule Tailwind (`@theme`, `@apply`, `@utility`, `@custom-variant`).

## Konsekuensi

- ✅ Bisa memakai komponen shadcn/ui siap pakai dan skala desain Tailwind yang seragam.
- ✅ Halaman tetap tanpa JavaScript selama komponen tidak memakai `client:*`.
- ⚠️ Gaya Satamu berbeda dari prasetya-webworks (CSS biasa); aturan CSS di AGENTS.md kedua proyek tidak sama.
- ⚠️ `npx shadcn add` gagal di dalam proyek karena aturan `allowScripts` npm. Jalankan dengan `--cwd` dari luar folder, atau salin dari registry (`https://ui.shadcn.com/r/styles/new-york-v4/<nama>.json`) dan ganti import `cn` ke `@/lib/utils`.
- ⚠️ Dependency dikunci ke versi yang sama dengan prasetya-webworks (Astro 7.3.8) karena versi lebih baru sempat gagal di CI Linux.
