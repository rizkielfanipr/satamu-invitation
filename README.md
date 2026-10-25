# Satamu Invitation

Landing page dan pemesanan **Satamu**, brand undangan digital dari Prasetya Webworks.

- Production (rencana): https://satamu.prasetyawebworks.web.id
- Stack: Astro (statis), konvensi sama dengan `../prasetya-webworks`
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
│   ├── layout/       bagian situs (SiteFooter)
│   └── home/         satu komponen per section home, disusun di HomePage.astro
├── config/site.ts    konstanta situs (nama, WhatsApp, logo, induk brand)
├── i18n/content.ts   semua teks yang tampil
├── scripts/          logika browser bersama (whatsappUrl)
└── styles/global.css token desain dari logo + gaya dasar
```

Dokumentasi: [docs/README.md](docs/README.md).
# satamu-invitation
