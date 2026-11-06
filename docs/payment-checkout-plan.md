# Rencana Order dan Pembayaran Online Satamu

## Status

Draft untuk persetujuan — 6 November 2026

## Ringkasan

Satamu akan mempertahankan konsultasi WhatsApp dan menambahkan pilihan **Langsung bayar**. Situs Astro tidak berkomunikasi langsung dengan Duitku. Seluruh harga, order, checkout, callback, dan status pembayaran dimiliki Prasetya Platform.

```text
Satamu Astro -> Prasetya Platform -> Duitku hosted checkout
      ^                 |
      +---- status -----+
```

Keputusan arsitektur dicatat di [ADR 0004](decisions/0004-online-payment-through-platform.md).

## Tujuan

- Pelanggan dapat memilih tema dan paket, mengisi data acara, lalu membayar langsung.
- Pelanggan tetap dapat berkonsultasi melalui WhatsApp.
- Harga dan status pembayaran hanya berasal dari Prasetya Platform.
- Transaksi Satamu dapat dipantau terpisah di back office bersama transaksi Webworks.

## Di luar cakupan

- Pembuatan WordPress Multisite otomatis.
- Portal pelanggan untuk mengedit undangan.
- Refund otomatis dan pencairan dana.
- Menyimpulkan pembayaran dari return URL Duitku.

## Prasyarat bisnis

Sebelum implementasi production:

1. Sahkan paket, harga, fitur, batas revisi, dan masa aktif.
2. Sahkan tema yang benar-benar tersedia; `T01`–`T18` saat ini masih dummy.
3. Tetapkan jenis acara dan kebijakan pembatalan/refund.
4. Terbitkan kebijakan privasi dan persetujuan penyimpanan data pelanggan.
5. Putuskan bahwa satu merchant Duitku dipakai bersama Webworks dan Satamu, kecuali settlement harus dipisah.

## Pengalaman pengguna

### Halaman order

Route: `/order/`.

Urutan form:

1. Pilih tema.
2. Pilih paket.
3. Isi nama, email, dan WhatsApp.
4. Isi jenis serta tanggal acara.
5. Isi catatan opsional.
6. Setujui ketentuan dan kebijakan privasi.
7. Tinjau ringkasan.

Setelah validasi, dialog menawarkan:

- **Konsultasi dulu** — membuka WhatsApp dengan ringkasan yang sama.
- **Langsung bayar** — membuat order di platform dan mengarahkan pelanggan ke hosted checkout Duitku.

Jika platform tidak tersedia, pembayaran dinonaktifkan dan WhatsApp tetap berfungsi.

### Kontrak order

Frontend mengirim kode, bukan nominal:

```json
{
  "application_code": "SATAMU",
  "package_code": "SAT-SPESIAL",
  "customer": {
    "name": "Nama pelanggan",
    "email": "pelanggan@example.com",
    "phone": "628123456789"
  },
  "details": {
    "theme_code": "T01",
    "event_type": "wedding",
    "event_date": "2027-02-20",
    "notes": null
  }
}
```

Harga dialog harus dibaca dari `GET /api/v1/packages?application_code=SATAMU`. Harga dari konten statis hanya bersifat katalog dan tidak menjadi sumber transaksi.

### Halaman status

Route: `/order/status/?order=<public-reference>`.

Halaman membaca `GET /api/v1/orders/{reference}/payment-status` dan menampilkan keadaan:

- menyiapkan pembayaran;
- menunggu pembayaran;
- pembayaran diterima;
- pembayaran belum selesai dan dapat dicoba lagi;
- order ditutup atau kedaluwarsa;
- layanan tidak tersedia.

Kembalinya browser dari Duitku bukan bukti pembayaran.

## Tahap implementasi

### Fase 1 — Baseline platform

- Stabilkan dan merge gateway Duitku.
- Aktifkan katalog Satamu setelah harga final disetujui.
- Verifikasi CORS, return URL Satamu, callback, dan prefix invoice `SAT`.

### Fase 2 — Order Satamu

- Tambahkan kode paket permanen pada data UI.
- Buat halaman dan komponen form order sesuai design system Satamu.
- Bawa pilihan tema/paket dari kartu katalog ke form.
- Tambahkan consent, validasi, ringkasan, dan fallback WhatsApp.

### Fase 3 — Checkout dan status

- Tambahkan client API, idempotency key, dialog pilihan, redirect checkout, retry, dan halaman status.
- Simpan hanya idempotency key dan locale di `sessionStorage`; jangan simpan data pembayaran.

### Fase 4 — QA dan rollout

- Uji dengan fake gateway lokal, kemudian Duitku sandbox.
- Uji 360 px, 768 px, dan desktop tanpa horizontal scroll.
- Aktifkan `PUBLIC_PLATFORM_API_URL` di staging terlebih dahulu, lalu production.

## Acceptance criteria

- Paket Satamu yang tidak aktif tidak dapat dibeli.
- Harga transaksi tidak pernah berasal dari request browser.
- Klik ulang tidak membuat order atau payment attempt ganda.
- Order Satamu hanya menerima paket milik Satamu.
- Callback palsu, signature salah, dan amount mismatch tidak menghasilkan `PAID`.
- Return dari Duitku tidak menghasilkan status lunas tanpa bukti backend.
- Order lunas tampil sebagai Satamu di back office dan berstatus `CONFIRMED`.
- WhatsApp tetap dapat digunakan ketika API atau Duitku gagal.
- Tidak ada credential, signature, raw callback, atau data pribadi di log frontend.

## Rencana PR

1. Platform: stabilisasi Duitku.
2. Platform: aktivasi katalog dan kontrak Satamu.
3. Satamu: form order dan dialog pilihan.
4. Satamu: checkout dan halaman status.
5. Integrasi: sandbox, dokumentasi operasional, dan rollout production.

## Rollback

Kosongkan `PUBLIC_PLATFORM_API_URL` pada build Satamu untuk kembali ke alur WhatsApp tanpa menghapus order atau payment platform. Penonaktifan paket dilakukan di katalog platform, bukan dengan mengubah harga di frontend.
