# Deployment

Push ke `main` menjalankan `.github/workflows/deploy.yml`: `npm ci` → `npm run validate` → `npm test` → `npm run test:e2e` → `npm run build` → `rsync` isi `dist/` lewat SSH ke cPanel. Pull request hanya validasi dan build, tanpa deploy. Bisa juga dijalankan manual dari tab **Actions → Run workflow**.

Polanya sama dengan `../prasetya-webworks` (lihat `docs/deployment.md` di sana untuk detail server, DNS dan SSL).

## Secret GitHub

Repo → **Settings → Secrets and variables → Actions → Repository secrets**.

| Nama | Isi |
|---|---|
| `SSH_PRIVATE_KEY` | Private key deploy yang sama dengan repo prasetya-webworks (`~/.ssh/griv_deploy_ed25519`, file **tanpa** `.pub`) |

## Variable GitHub: pembayaran online

Repo → **Settings → Secrets and variables → Actions → Variables**.

| Nama | Isi |
|---|---|
| `PUBLIC_PLATFORM_API_URL` | `https://platform.prasetyawebworks.web.id` untuk mengaktifkan **Langsung bayar**. Kosong atau tidak ada: form order hanya menawarkan konsultasi WhatsApp |

Nilainya dibaca saat build (`site.platformApiUrl` di `src/config/site.ts`), jadi perubahan baru berlaku setelah workflow dijalankan ulang. Ini bukan secret: alamat API terlihat di browser.

Host key `server.griv.co.id` dipatok di workflow. Cara membuat atau mengganti key ada di dokumen deployment prasetya-webworks.

## Server

```
/home/prasetya/public_html/satamu.prasetyawebworks.web.id/   ← document root subdomain, diisi oleh CI
├── .htaccess, php.ini, .user.ini   ← dibuat cPanel, dikecualikan dari rsync (tidak ditimpa/dihapus)
├── .well-known/                    ← validasi SSL, dikecualikan dari rsync
└── index.html, images/, …          ← hasil build
```

Subdomain dibuat di cPanel → Domains. DNS dan SSL (AutoSSL) otomatis.

## Verifikasi setelah deploy

```sh
curl -s -o /dev/null -w '%{http_code}\n' https://satamu.prasetyawebworks.web.id/
curl -s https://satamu.prasetyawebworks.web.id/order/ | grep -o 'data-online-payment="[a-z]*"'
```

`data-online-payment="false"` berarti mode WhatsApp saja; `"true"` berarti pembayaran online aktif.

## Aktivasi pembayaran online

Urutan lengkap ada di runbook deployment Prasetya Platform (`../prasetya-platform/docs/runbooks/deployment.md`, bagian *Satamu online payment*). Ringkasnya:

1. Deploy platform dengan paket Satamu masih nonaktif.
2. Deploy Satamu tanpa `PUBLIC_PLATFORM_API_URL`; cek form order hanya menawarkan WhatsApp.
3. Uji lokal dengan fake gateway, lalu satu pembayaran Duitku sandbox sampai status lunas dan tampil di back office.
4. Setelah harga dan paket disetujui pemilik, aktifkan paket di platform (`platform:package-activate`).
5. Isi variable `PUBLIC_PLATFORM_API_URL`, lalu jalankan ulang workflow.

## Uji lokal dengan platform

1. Jalankan Prasetya Platform dengan `PAYMENT_GATEWAY=fake`, `CORS_ALLOWED_ORIGINS` berisi `http://localhost:4322`, dan `PAYMENT_RETURN_URL_SATAMU=http://localhost:4322/order/status/`. Aktifkan paket Satamu lokal dengan `php artisan platform:package-activate <kode> --reason=lokal --force`.
2. Jalankan Satamu: `PUBLIC_PLATFORM_API_URL=http://127.0.0.1:8000 npm run dev -- --port 4322`.
3. Pesan dari `/order/`, selesaikan di halaman fake checkout, lalu cek `/order/status/` dan back office.

## Rollback

`git revert <commit>` lalu push ke `main`, atau **Re-run all jobs** pada run deploy dari commit yang masih bagus.

Untuk mematikan pembayaran online saja: kosongkan variable `PUBLIC_PLATFORM_API_URL` lalu **Run workflow**. Order dan pembayaran yang sudah ada tetap di platform dan tetap diproses; jangan menghapusnya.
