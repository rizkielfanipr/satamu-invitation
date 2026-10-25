# Deployment

Push ke `main` menjalankan `.github/workflows/deploy.yml`: `npm ci` → `npm run validate` → `npm run build` → `rsync` isi `dist/` lewat SSH ke cPanel. Pull request hanya validasi dan build, tanpa deploy. Bisa juga dijalankan manual dari tab **Actions → Run workflow**.

Polanya sama dengan `../prasetya-webworks` (lihat `docs/deployment.md` di sana untuk detail server, DNS dan SSL).

## Secret GitHub

Repo → **Settings → Secrets and variables → Actions → Repository secrets**.

| Nama | Isi |
|---|---|
| `SSH_PRIVATE_KEY` | Private key deploy yang sama dengan repo prasetya-webworks (`~/.ssh/griv_deploy_ed25519`, file **tanpa** `.pub`) |

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
```

## Rollback

`git revert <commit>` lalu push ke `main`, atau **Re-run all jobs** pada run deploy dari commit yang masih bagus.
