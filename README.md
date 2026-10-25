# Satamu Invitation

Landing page dan pemesanan **Satamu**, brand undangan digital dari Prasetya Webworks.

- Production (rencana): https://satamu.prasetyawebworks.web.id
- Stack: Astro (statis) + Tailwind CSS v4 + shadcn/ui (React, dirender jadi HTML statis). Tooling sama dengan `../prasetya-webworks`, gaya berbeda (lihat ADR 0002).
- Rencana besar Prasetya Group (Laravel API/admin, WordPress Multisite undangan): `../README.md`

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm install` | Pasang dependency |
| `npx astro dev --background` | Dev server di latar belakang (`astro dev stop` / `status` / `logs`) |
| `npm run format` | Rapikan semua file dengan Prettier |
| `npm run validate` | Prettier check, ESLint, Stylelint, `astro check` (harus 0 error) |
| `npm run build` | Build ke `dist/` |
| `npm run preview` | Lihat hasil build |

## Struktur

```text
src/
├── pages/            hanya rute; memanggil komponen halaman dengan locale
├── layouts/          Layout.astro (<head>, meta, Open Graph)
├── components/
│   ├── layout/       bagian situs (SiteHeader, SiteFooter)
│   ├── ui/           komponen generik: shadcn/ui (button.tsx, …) dan SectionIntro
│   ├── home/         satu komponen per section home (HeroSection, ThemesSection, PricingSection, FaqSection, PhoneMockup), disusun di HomePage.astro
│   └── themes/       katalog tema (ThemeGrid, ThemeCard, ThemeCatalogPage)
├── config/site.ts    konstanta situs (nama, WhatsApp, logo, induk brand)
├── data/themes.ts    data tema (dummy untuk sekarang) dan helper urutan/kategori
├── i18n/content.ts   semua teks yang tampil
├── lib/utils.ts      cn() untuk menggabungkan class Tailwind
├── scripts/          logika browser bersama (whatsappUrl, initSiteHeader, initThemeFilter)
└── styles/global.css Tailwind + variabel tema shadcn dari warna logo
components.json       konfigurasi shadcn/ui (alias @/, gaya new-york)
```

Dokumentasi: [docs/README.md](docs/README.md).
