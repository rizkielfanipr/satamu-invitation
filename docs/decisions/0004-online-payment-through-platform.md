# ADR 0004 — Pembayaran online melalui Prasetya Platform

## Status

Proposed — 6 November 2026

## Konteks

Satamu adalah situs Astro statis. Pelanggan saat ini diarahkan ke WhatsApp, sementara Prasetya Platform sudah dirancang sebagai pemilik bersama order dan pembayaran Webworks serta Satamu. Platform menyediakan katalog paket, idempotent order API, hosted checkout Duitku, callback terverifikasi, dan status pembayaran.

## Keputusan

- Satamu tidak memanggil Duitku secara langsung; seluruh komunikasi gateway melalui Prasetya Platform.
- Setelah form dikirim, pelanggan memilih **Konsultasi dulu** atau **Langsung bayar**.
- Fitur online payment hanya aktif ketika `PUBLIC_PLATFORM_API_URL` tersedia saat build. Jika kosong, pengalaman kembali ke WhatsApp.
- Frontend mengirim `application_code=SATAMU`, kode paket, data pelanggan, serta `theme_code`, `event_type`, `event_date`, dan catatan. Frontend tidak mengirim harga.
- Harga ditampilkan dari katalog platform sebelum checkout.
- Browser menyimpan idempotency key dan locale saja di `sessionStorage`.
- `/order/status/` selalu membaca status platform. Return URL Duitku tidak dianggap sebagai bukti pembayaran.
- Webworks dan Satamu berbagi payment core dan merchant Duitku; identitas brand dipisahkan oleh application code dan prefix invoice.

## Konsekuensi

- Satu payment core mengurangi duplikasi keamanan, callback, dan rekonsiliasi.
- Satamu tetap dapat menerima konsultasi ketika platform bermasalah.
- Data pelanggan tersimpan di platform sehingga kebijakan privasi wajib tersedia sebelum go-live.
- Paket dan tema dummy tidak boleh diaktifkan di production sebelum keputusan bisnis selesai.
- Perubahan harga dilakukan pada katalog platform; konten statis Satamu harus disinkronkan agar tidak menyesatkan.

## Alternatif yang ditolak

- **Duitku langsung dari Astro.** Ditolak karena secret, signature, callback, dan kebenaran status membutuhkan backend.
- **Pembayaran hanya lewat WhatsApp.** Tetap menjadi fallback, tetapi tidak memenuhi kebutuhan pembayaran langsung.
- **Payment backend Satamu terpisah.** Ditolak karena menduplikasi state machine, webhook, keamanan, dan back office.

## Validasi

- Feature test order dan checkout `SATAMU` pada Prasetya Platform.
- Integration test callback dan transaction check Duitku.
- Browser test form, fallback WhatsApp, redirect checkout, retry, dan status paid/pending/expired.
- Sandbox test dari Satamu sampai transaksi tampil di back office.

## Terkait

- [Rencana order dan pembayaran](../payment-checkout-plan.md)
- `../../../prasetya-webworks/docs/decisions/0012-online-payment-through-platform.md`
- `../../../prasetya-platform/docs/api/duitku-contract.md`
