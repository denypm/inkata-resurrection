# Eduvara SD Tryout — versi website publik

Website tryout TKA SD (kelas 6): simulasi CBT Matematika & Bahasa Indonesia, latihan harian,
bank soal, ranking, dan rapor. Satu halaman HTML statis + Supabase (database & login Google).

| File | Isi |
|---|---|
| `index.html` | Seluruh aplikasi (vanilla JS, tanpa build) |
| `adapter.js` | Penghubung ke Supabase, meniru API `window.claude.use("db"/"user")` dari versi artifact |
| `config.js` | URL proyek + anon key Supabase (wajib diisi) |
| `schema.sql` | Tabel, Row Level Security, fungsi admin, realtime |
| `fitur.js` | Mega Tryout, Belajar per bab, Liga & lencana, orang tua, Tanya Soal, Premium |
| `supabase/functions/` | Edge Functions: `tanya` (Claude), `bayar` & `midtrans-webhook` (Midtrans) |

Siapa pun bisa membuka situs dan mengerjakan soal tanpa login. Siswa yang **masuk dengan Google**
nilainya tersimpan dan ikut ranking. Nama siswa dan ranking hanya terlihat oleh pengguna yang sudah masuk.

## Langkah pemasangan (±15 menit)

### 1. Buat proyek Supabase
1. Buka https://supabase.com → **New project** (paket gratis cukup). Catat region terdekat (Singapore).
2. **SQL Editor → New query**, tempel isi `schema.sql`, klik **Run**.
3. Masih di SQL Editor, jadikan akun Google Anda admin (huruf kecil semua):
   ```sql
   insert into public.admins(email) values ('email-google-anda@gmail.com') on conflict do nothing;
   ```

### 2. Aktifkan login Google
1. Google Cloud Console → **APIs & Services → Credentials → Create credentials → OAuth client ID**
   (tipe *Web application*). Jika diminta, isi dulu *OAuth consent screen* (External, nama aplikasi "Eduvara").
2. Di **Authorized redirect URIs** isi: `https://PROJECT-ANDA.supabase.co/auth/v1/callback`
3. Supabase → **Authentication → Sign In / Providers → Google**: aktifkan, tempel Client ID & Client Secret.
4. Supabase → **Authentication → URL Configuration**:
   - *Site URL*: alamat situs Anda, mis. `https://eduvara.netlify.app`
   - *Redirect URLs*: tambahkan alamat yang sama (dan `http://localhost:8000` jika ingin uji lokal).

### 3. Isi `config.js`
Supabase → **Project Settings → API**: salin *Project URL* dan *anon public key* ke `config.js`.
Anon key aman untuk publik (akses diatur RLS). **Jangan** pernah menaruh *service_role key* di situs.

### 4. Deploy (pilih salah satu)
- **Vercel**: Add New → Project → impor repo ini → *Root Directory* = `eduvara`, *Framework Preset* = Other,
  tanpa build command → Deploy. (Proyek Vercel terpisah dari Inkata.)
- **Netlify / Cloudflare Pages**: base directory `eduvara`, tanpa build command.
- **GitHub Pages**: salin isi folder ini ke repo/branch Pages.

Setelah mendapat alamat situs, masukkan alamat itu ke langkah 2.4.

### 5. Pindahkan bank soal dari versi claude.ai
1. Buka artifact lama → **Kelola Soal → Cadangan bank soal → Tampilkan cadangan (JSON) → Salin semua**.
2. Buka situs baru, masuk dengan Google (akun admin) → **Kelola Soal → Impor JSON** → tempel → **Impor**.

## Fitur
| Fitur | Halaman | Catatan |
|---|---|---|
| **Halaman TKA SD** | `#tka` | Hitung mundur ke perkiraan TKA SD April 2027 (ubah `TKA_TARGET` di `fitur.js` saat jadwal resmi keluar), alasan pentingnya TKA, format, kisi-kisi per elemen, contoh soal, strategi, FAQ |
| **Drill Soal & rekomendasi** | `#belajar`, `#rapor` | Bab dikelompokkan per elemen kisi-kisi resmi (Matematika: Bilangan / Geometri & Pengukuran / Data; Bahasa Indonesia: Pemahaman Tekstual / Inferensial / Evaluasi & Apresiasi). Drill: pilih bab, tingkat, jumlah soal. Rapor menampilkan bab yang perlu dikuasai |
| **Nilai IRT & leaderboard nasional** | `#mega` | Mega Tryout menyimpan pola benar/salah per soal; saat diumumkan, tiap soal diberi bobot 1–3 menurut tingkat kesulitannya (proporsi peserta yang benar). Peringkat nasional, persentil, dan daftar soal tersulit |
| Tryout CBT per mapel | `#tryout` | Timer, ragu-ragu, pembahasan. Akun gratis 3× per minggu, Premium tanpa batas |
| **Mega Tryout serentak** | `#tryout`, `#mega` | Admin membuat event di Kelola Soal (jadwal, jendela, waktu pengumuman, gratis/premium). Soal sama untuk semua peserta; nilai, peringkat, persentil, dan pembahasan dibuka bersamaan |
| **Belajar per bab** | `#belajar` | 12 bab (8 Matematika, 4 Bahasa Indonesia) dengan rangkuman materi + latihan mudah/sedang/sulit, 3 bintang per bab. Rangkuman bisa diubah di Kelola Soal |
| Latihan harian | `#harian` | 20 soal baru tiap pagi |
| **Liga XP & lencana** | `#ranking`, `#akun` | XP = 10/benar tryout & Mega Tryout, 5/benar harian & belajar. Liga Perunggu → Perak → Emas → Berlian, papan liga mingguan, 10 lencana |
| **Pantauan orang tua** | `#akun`, `#anak-…` | Anak membuat kode pantau (24 jam); orang tua masuk dengan Google lalu memasukkan kode dan bisa melihat rapor anak |
| **Tanya Soal** | `#tanya` | Foto/ketik soal → dijelaskan AI (Claude) langkah demi langkah; guru/admin memverifikasi; jawaban terverifikasi bisa dicari siswa lain. Gratis 3/hari, Premium 30/hari |
| **Paket Premium** | `#paket` | Pembayaran Midtrans (QRIS, VA, e-wallet). Harga di tabel `paket` |
| Ranking & rapor | `#ranking`, `#rapor` | |

## Edge Functions (Tanya Soal & pembayaran)
Butuh [Supabase CLI](https://supabase.com/docs/guides/cli). Dari folder `eduvara/`:

```
supabase login
supabase link --project-ref PROJECT-ANDA
supabase secrets set ANTHROPIC_API_KEY=...            # dari console.anthropic.com
supabase secrets set MIDTRANS_SERVER_KEY=... MIDTRANS_PRODUCTION=false   # true saat sudah live
supabase functions deploy tanya
supabase functions deploy bayar
supabase functions deploy midtrans-webhook --no-verify-jwt
```

- **Tanya Soal** memakai model `claude-opus-5-5` (effort `medium`) dengan *refusal fallback* sisi server aktif
  (`fallbacks: "default"`): jika model menolak, permintaan otomatis dicoba ulang di model cadangan.
  Perkiraan biaya API ±Rp500–1.500 per pertanyaan (tarif $4/$20 per juta token input/output; tergantung panjang jawaban dan foto). Kuota harian membatasi pemakaian; model bisa diganti di `tanya/index.ts` jika ingin lebih murah.
- **Midtrans**: daftar di midtrans.com, ambil *Server Key* (Sandbox dulu untuk uji coba). Di Dashboard Midtrans →
  Settings → Payment → *Notification URL* isi `https://PROJECT-ANDA.supabase.co/functions/v1/midtrans-webhook`.
  Webhook memeriksa tanda tangan SHA-512 dan jumlah bayar sebelum mengaktifkan Premium.
- Ubah harga/paket langsung di tabel `paket` (Table Editor). Harga diambil server, bukan dari browser.

## Soal harian otomatis
Tugas terjadwal "Bank Soal Harian Eduvara SD" saat ini menulis ke database artifact claude.ai.
Supaya soal baru masuk ke situs ini, tugas itu perlu diubah agar menyimpan ke tabel `bank` lewat
REST API Supabase:

```
POST https://PROJECT-ANDA.supabase.co/rest/v1/bank
Prefer: resolution=merge-duplicates
apikey / Authorization: Bearer <service_role key>   ← disimpan sebagai kredensial lingkungan, bukan di repo
{"id":"sd-d-2026-11-16","tanggal":"2026-11-16","jenjang":"sd","sumber":"harian","soal":[ ... ]}
```

## Model data
- `bank(id, tanggal, jenjang, sumber, soal jsonb)`. Format soal sama dengan versi artifact
  (`pg` / `pgk` / `bs`, kunci indeks / array indeks / array boolean).
- `scores(uid, data jsonb)`: ringkasan untuk ranking `{best, tryout, rata, poin, streak, harianBenar, updatedAt}`.
- `user_docs(uid, doc_id, data jsonb)`: `t-<timestamp>` hasil tryout, `h-YYYY-MM-DD` progres harian.
- `profiles(uid, name)`: nama dari akun Google, untuk ranking.
- `admins(email)`: siapa yang boleh membuka Kelola Soal dan menulis ke `bank`.

Catatan: ranking dihitung dari dokumen `scores` milik siswa sendiri, jadi siswa yang paham teknis
masih bisa mengubah poinnya. Untuk kompetisi resmi, hitung ulang poin di server (fungsi Postgres).

## Uji lokal
```
cd eduvara && python3 -m http.server 8000
```
Buka http://localhost:8000 (tambahkan alamat ini ke Redirect URLs Supabase agar login berfungsi).
