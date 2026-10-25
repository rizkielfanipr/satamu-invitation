# Arsitektur

## Sekarang

Website statis Astro dengan satu halaman "segera hadir": logo, judul, deskripsi dan tombol tanya lewat WhatsApp. Belum ada deploy otomatis; CI hanya menjalankan `npm run validate` dan `npm run build`.

## Rencana

```text
satamu.prasetyawebworks.web.id   (repo ini, Astro)   landing, katalog tema, form order
            │ API (/api/v1/...)
            ▼
Laravel + admin panel (repo terpisah)                order, pembayaran, pelanggan, status undangan
            │ setelah lunas: buat undangan (manual dulu, nanti otomatis)
            ▼
WordPress Multisite khusus undangan                  1 subsite = 1 undangan pelanggan (tema, ?to=, RSVP)
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
- Font brand: wordmark di `satamu-logo-flat.svg` masih memakai teks sistem (Avenir Next); perlu diubah menjadi path seperti logo Prasetya agar tampil sama di semua perangkat.
