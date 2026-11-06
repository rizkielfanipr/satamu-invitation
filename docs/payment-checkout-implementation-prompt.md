# Prompt Implementasi Order dan Pembayaran Satamu

Salin prompt berikut ke coding agent dari workspace `/Users/air/Projects/prasetya-group`. Prompt ini sengaja meminta audit terlebih dahulu dan implementasi bertahap agar perubahan payment tidak menimpa pekerjaan yang sedang berlangsung.

---

## Prompt

Anda bekerja pada tiga repository yang saling terkait:

- `/Users/air/Projects/prasetya-group/prasetya-platform`
- `/Users/air/Projects/prasetya-group/satamu-invitation`
- `/Users/air/Projects/prasetya-group/prasetya-webworks` sebagai referensi implementasi frontend

Tujuan akhir: pelanggan Satamu dapat memilih tema dan paket, mengisi data acara, lalu memilih **Konsultasi dulu** melalui WhatsApp atau **Langsung bayar** melalui hosted checkout Duitku. Satamu tidak boleh berkomunikasi langsung dengan Duitku; seluruh harga, order, checkout, callback, payment evidence, status, dan rekonsiliasi dimiliki Prasetya Platform.

### 1. Instruksi awal wajib

1. Baca penuh `AGENTS.md` pada setiap repository sebelum melakukan perubahan.
2. Baca dokumen berikut sebagai source of truth:
   - `satamu-invitation/docs/payment-checkout-plan.md`
   - `satamu-invitation/docs/decisions/0004-online-payment-through-platform.md`
   - `satamu-invitation/docs/architecture.md`
   - `satamu-invitation/docs/design.md`
   - `prasetya-platform/docs/satamu-payment-activation-plan.md`
   - `prasetya-platform/docs/decisions/0008-satamu-payment-activation.md`
   - `prasetya-platform/docs/decisions/0007-duitku-gateway.md`
   - `prasetya-platform/docs/api/duitku-contract.md`
   - `prasetya-platform/docs/api/openapi.yaml`
   - `prasetya-platform/docs/data-dictionary.md`
   - `prasetya-platform/docs/security/threat-model.md`
   - `prasetya-platform/docs/testing/strategy.md`
   - `prasetya-webworks/docs/decisions/0012-online-payment-through-platform.md`
3. Jalankan `git status --short` di ketiga repository.
4. Anggap semua perubahan yang sudah ada sebagai milik pengguna. Jangan reset, checkout, stash, menghapus, atau menimpa perubahan tersebut.
5. Jika perubahan aktif bertumpang tindih dengan file yang perlu diedit, buat worktree atau branch terisolasi dari commit yang tepat, atau berhenti dan laporkan konflik sebelum mengubah file.
6. Jangan memulai implementasi Satamu sebelum baseline Duitku di `prasetya-platform` dipahami dan lolos test terkait.
7. Jangan mengubah harga, paket, tema, kebijakan refund, atau data production berdasarkan asumsi. Jika keputusan bisnis belum final, gunakan feature gate dan pertahankan paket Satamu nonaktif di production.

### 2. Invariant keamanan yang tidak boleh dilanggar

- Hanya `ApplyPaymentEvidence` yang boleh mengubah payment menjadi `PAID`.
- Semua perubahan status harus melalui `TransitionPaymentStatus` dan `TransitionOrderStatus`.
- Harga hanya berasal dari package catalogue platform. Request browser tidak boleh membawa atau menentukan nominal transaksi.
- Satamu hanya boleh membeli package milik application `SATAMU` yang aktif.
- Callback Duitku tidak cukup untuk membuktikan pembayaran. Success callback wajib dikonfirmasi dengan server-to-server transaction check.
- Return URL browser tidak pernah mengubah status pembayaran.
- Jangan menyimpan atau mencatat secret, signature, raw callback body, data kartu, atau data pribadi berlebih.
- Jangan melakukan network call di dalam database transaction.
- Duitku-specific code harus tetap berada di `app/Integrations/Duitku`.
- Controller harus tipis; aturan bisnis tetap berada di domain actions/services.
- Public identifier harus menggunakan reference/ULID, bukan numeric database ID.
- Order dan checkout harus idempotent dan aman terhadap double click, refresh, retry, serta replay.
- Payment attempt yang sudah diterbitkan harus tetap dapat menerima callback walaupun order Satamu baru dinonaktifkan.

### 3. Hasil yang harus dibangun

#### A. Prasetya Platform

Audit terlebih dahulu apakah capability berikut sudah lengkap dan benar. Reuse implementasi yang sudah ada; jangan membuat payment core kedua.

1. Application `SATAMU` aktif sebagai brand yang valid.
2. Prefix invoice Satamu adalah `SAT`.
3. Package code permanen:
   - `SAT-SEDERHANA`
   - `SAT-SPESIAL`
   - `SAT-ISTIMEWA`
4. Satamu package tidak otomatis aktif hanya karena environment non-production/production. Sediakan explicit catalogue activation yang fail-closed.
5. Package catalogue menolak:
   - package tidak aktif;
   - package milik brand lain;
   - package code tidak dikenal.
6. Order Satamu menerima detail allow-list berikut saja:
   - `theme_code`
   - `event_type`
   - `event_date` dengan format `Y-m-d`
   - `notes`
7. Pastikan endpoint berikut menjadi kontrak yang stabil:
   - `GET /api/v1/packages?application_code=SATAMU`
   - `POST /api/v1/orders`
   - `POST /api/v1/orders/{reference}/checkout`
   - `GET /api/v1/orders/{reference}/payment-status`
   - `POST /api/v1/webhooks/duitku`
8. Return URL dipilih berdasarkan application dan memakai `PAYMENT_RETURN_URL_SATAMU`.
9. CORS hanya mengizinkan origin Satamu yang disetujui, Webworks, dan origin development eksplisit.
10. Back office menampilkan dan dapat memfilter:
    - brand Satamu;
    - package;
    - theme code;
    - event type;
    - event date;
    - order status;
    - payment status dan attempt;
    - evidence/callback yang sudah disanitasi.
11. Fulfilment invitation tetap manual pada fase pertama; jangan membuat otomatisasi WordPress dalam scope ini.
12. Sinkronkan OpenAPI, data dictionary, testing strategy, security documentation, deployment runbook, dan reconciliation runbook jika implementasi mengubah kontrak atau operasi.

Payload order yang diharapkan:

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

Nominal, currency, payment status, dan order status tidak boleh diterima dari payload publik.

#### B. Satamu Invitation

Ikuti konvensi Satamu: Astro, Tailwind CSS v4, shadcn/ui, seluruh copy di `src/i18n/content.ts`, mobile-first, semantic tokens, tidak ada raw colour jika token tersedia, dan tidak ada `<style>` baru di komponen.

1. Tambahkan `platformApiUrl` pada `src/config/site.ts` dari `PUBLIC_PLATFORM_API_URL`. Nilai kosong menonaktifkan online payment dan mempertahankan WhatsApp-only flow.
2. Tambahkan permanent package code ke data paket tanpa menjadikan harga statis sebagai price authority.
3. Tambahkan route:
   - `/order/`
   - `/order/status/`
4. Semua tombol berikut harus dapat membawa konteks ke order form:
   - Order Sekarang;
   - CTA hero;
   - Pilih Paket;
   - Pakai Tema.
5. Form order minimal memiliki:
   - tema;
   - package;
   - nama pelanggan;
   - email;
   - WhatsApp;
   - jenis acara;
   - tanggal acara;
   - catatan opsional;
   - consent ketentuan dan kebijakan privasi.
6. Pilihan dari query string harus divalidasi terhadap data lokal. Unknown theme/package tidak boleh dipercaya atau menyebabkan error.
7. Setelah validasi, tampilkan ringkasan dan dialog pilihan:
   - **Konsultasi dulu** membuka WhatsApp dengan ringkasan;
   - **Langsung bayar** membuat order dan checkout melalui platform.
8. Harga pada dialog harus dibaca dari platform menggunakan package code. Jika price lookup gagal, tombol pembayaran nonaktif tetapi WhatsApp tetap tersedia.
9. Adaptasi pola client dari Webworks, tetapi jangan copy UI/CSS secara buta. Buat shared browser logic Satamu di `src/scripts/` dan gunakan komponen/design system Satamu.
10. Implementasikan idempotency:
    - satu intent dengan payload yang sama menggunakan order key dan checkout key yang sama;
    - replay tidak membuat order kedua;
    - retry checkout setelah attempt gagal dapat memakai key baru sesuai kontrak platform;
    - `sessionStorage` hanya berisi key dan locale/context non-sensitif, bukan personal/payment data.
11. Redirect ke checkout URL HTTPS dari platform.
12. Halaman `/order/status/` membaca public order reference dari query parameter dan meminta status ke platform.
13. Status page harus menangani:
    - loading;
    - paid;
    - pending;
    - retryable/not completed;
    - closed/expired;
    - invalid reference;
    - platform unavailable.
14. Jika status adalah paid, tampilkan bahwa pembayaran diterima dan tim akan memproses materi undangan. Jangan menjanjikan provisioning otomatis.
15. Jika checkout URL masih tersedia, tampilkan **Lanjutkan pembayaran**. Jika retry diperbolehkan, gunakan endpoint checkout dengan idempotency key baru.
16. Jangan pernah menganggap parameter return Duitku sebagai bukti pembayaran.
17. Seluruh UI harus accessible:
    - label dan error terhubung ke field;
    - dialog memiliki focus management dan keyboard close;
    - status memakai live region yang wajar;
    - focus visible;
    - reduced motion;
    - tidak ada horizontal scroll pada 360 px.

#### C. Prasetya Webworks

- Gunakan sebagai referensi kontrak dan pola saja.
- Jangan melakukan refactor atau perubahan visual Webworks kecuali diperlukan untuk memperbaiki shared contract yang terbukti rusak.
- Jangan menyalin hard-coded `WEBWORKS`, field business/domain, atau CSS Webworks ke Satamu.
- Jika ditemukan defect pada implementasi referensi, pisahkan perbaikannya dalam commit/PR tersendiri.

### 4. Copy dan UX minimum

Gunakan bahasa Indonesia yang ringkas dan konsisten dengan brand Satamu. Seluruh teks tetap berasal dari `src/i18n/content.ts`.

Dialog harus menjelaskan:

- harga diambil dari sistem pembayaran;
- pengerjaan dimulai setelah pembayaran diterima dan materi lengkap;
- konsultasi tetap tersedia;
- pembayaran diproses oleh Duitku;
- kembali dari halaman pembayaran belum tentu berarti pembayaran berhasil.

Status page harus menyediakan tautan bantuan WhatsApp dengan invoice/reference yang aman, tanpa menyertakan data pribadi di URL.

### 5. Test wajib

#### Platform

Tambahkan atau perbarui test untuk:

1. Satamu order + Satamu package berhasil dan memakai harga catalogue.
2. Satamu order + Webworks package ditolak.
3. Webworks order + Satamu package ditolak.
4. Package inactive/unknown ditolak.
5. Nominal dari browser diabaikan/tidak tervalidasi sebagai field yang diterima.
6. Detail Satamu di-allow-list; field brand lain tidak tersimpan.
7. Idempotent order replay.
8. Idempotent checkout replay dan concurrent-in-progress response.
9. Invoice prefix `SAT`.
10. Return URL Satamu digunakan pada checkout.
11. Callback signature/source/invoice/amount/status check.
12. Forged success, amount mismatch, unknown invoice, duplicate callback, delayed confirmation, dan gateway outage.
13. Paid evidence menghasilkan satu transisi payment dan order yang benar.
14. Back-office filter/detail Satamu.
15. CORS approved/rejected origins.

#### Satamu

Tambahkan unit/integration/browser test untuk:

1. CTA membawa theme/package yang valid ke form.
2. Unknown query values diabaikan dengan aman.
3. Validasi setiap field dan consent.
4. Price lookup menggunakan `SATAMU` dan package code.
5. Payload order tepat dan tidak mengandung price.
6. Double click/replay tidak membuat order kedua.
7. WhatsApp fallback saat API mati.
8. Redirect hanya ke checkout URL yang valid sesuai response platform.
9. Status paid, pending, retry, closed, invalid, dan unavailable.
10. Keyboard/focus dialog dan error announcement.
11. Layout 360 px, 768 px, dan desktop tanpa horizontal scroll.
12. Tidak ada regresi pada home dan catalog theme.

### 6. Validasi manual

1. Jalankan platform dengan fake gateway.
2. Jalankan Satamu lokal dengan `PUBLIC_PLATFORM_API_URL` menuju platform lokal.
3. Buat order Satamu dari theme dan package yang berbeda.
4. Verifikasi order hanya tercipta satu kali saat tombol diklik ulang.
5. Selesaikan fake payment dan verifikasi status page menjadi paid.
6. Verifikasi transaksi di back office berlabel Satamu dan detail event benar.
7. Uji fallback dengan mematikan platform.
8. Setelah local green, jalankan satu alur Duitku sandbox lengkap termasuk callback dan transaction check.

Jangan menggunakan credential production, mengirim payment production, atau mengubah data production sebagai bagian test.

### 7. Quality gates

Pada `prasetya-platform` jalankan seluruh gate yang diwajibkan `AGENTS.md`, termasuk:

```sh
vendor/bin/pint
npm run format
vendor/bin/phpstan analyse --memory-limit=1G
npm run lint
npm run typecheck
npm test
vendor/bin/pest
npm run build
npm run test:e2e
```

Pada `satamu-invitation` jalankan:

```sh
npm run format
npm run validate
npm run build
```

Lakukan visual QA hasil build pada 360 px, 768 px, dan desktop. Jika ada test yang tidak dapat dijalankan, jelaskan secara eksplisit apa yang tidak dijalankan dan alasannya; jangan menyatakan semua lulus.

### 8. Urutan delivery dan commit

Pisahkan pekerjaan agar mudah direview dan rollback:

1. `feat(platform): activate Satamu catalogue contract`
2. `test(platform): cover Satamu order and payment flow`
3. `feat(satamu): add order form and consultation choice`
4. `feat(satamu): add Duitku checkout and payment status`
5. `docs: complete Satamu payment rollout runbook`

Gunakan PR terpisah per repository. Jangan mencampur perubahan Platform dan Satamu dalam satu commit lintas repo.

### 9. Rollout

1. Deploy platform lebih dahulu dengan package Satamu masih inactive.
2. Deploy Satamu dengan `PUBLIC_PLATFORM_API_URL` kosong; verifikasi WhatsApp fallback.
3. Uji staging/fake dan sandbox.
4. Aktifkan package Satamu yang sudah disetujui.
5. Build dan deploy Satamu dengan platform URL aktif.
6. Pantau first orders, failed jobs, webhook events, reconciliation, dan logs.
7. Jangan hapus payment/order history saat rollback.

Rollback frontend: build ulang Satamu tanpa `PUBLIC_PLATFORM_API_URL`.

Rollback ordering: nonaktifkan Satamu packages di catalogue. Callback dan status untuk payment attempt yang sudah ada harus tetap berjalan.

### 10. Definition of done

Pekerjaan dianggap selesai hanya jika:

- seluruh keputusan bisnis yang diperlukan sudah disetujui atau fitur tetap fail-closed;
- Platform menjadi satu-satunya sumber harga dan payment truth;
- alur konsultasi dan bayar langsung berfungsi;
- fake gateway dan Duitku sandbox tervalidasi end-to-end;
- semua test dan quality gate yang relevan lulus;
- visual QA mobile/tablet/desktop lulus;
- OpenAPI, ADR, data dictionary, security, testing, deployment, dan reconciliation docs sinkron;
- tidak ada secret atau data production dalam git, log, screenshot, fixture, atau laporan;
- tersedia bukti test, daftar file berubah, migration impact, configuration checklist, rollout, dan rollback;
- implementer menyerahkan ringkasan per repository dan tautan/commit masing-masing, bukan hanya menyatakan “selesai”.

### 11. Format laporan akhir implementer

Laporkan:

1. Outcome pengguna.
2. Perubahan per repository.
3. Keputusan/asumsi bisnis yang masih terbuka.
4. Migration dan konfigurasi environment.
5. Daftar test beserta hasil aktual.
6. Hasil visual QA.
7. Hasil sandbox.
8. Risiko tersisa.
9. Langkah rollout dan rollback.
10. Commit/branch/PR per repository.

Jangan melakukan production deployment atau mengaktifkan package Satamu tanpa persetujuan eksplisit pengguna setelah staging dan sandbox berhasil.

---

## Catatan penggunaan

Prompt ini mencakup implementasi penuh. Untuk mengurangi risiko, jalankan per fase dan minta coding agent berhenti setelah setiap PR siap direview. Fase pertama yang direkomendasikan adalah audit dan stabilisasi `prasetya-platform`, bukan langsung membangun tombol bayar di Satamu.
