# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01. Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase. Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Berhasil. File baru `lib/supabase/server.js` dibuat berisi fungsi `createServerClient()` yang memakai `@supabase/supabase-js` dengan `SUPABASE_SECRET_KEY`. Halaman `app/page.jsx` diubah menjadi async Server Component yang memanggil `supabase.from("produk").select("*")`. Produk ditampilkan dengan `KartuProduk`, dan ada penanganan untuk kondisi error maupun tabel kosong. Import `CatatanBelumAktif` dan `data-contoh` sudah dihapus. Build berhasil tanpa error.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan. Fitur langsung berjalan sesuai kriteria.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Berhasil. Halaman `app/produk/[id]/page.jsx` diubah menjadi async Server Component. ID diambil dari `await params` (sesuai Next.js 16), lalu query `supabase.from("produk").select("*").eq("id", id).single()` dijalankan. Kalau data tidak ditemukan atau ada error, `notFound()` dipanggil. Import `CatatanBelumAktif` dan `data-contoh` dihapus, tombol WhatsApp tetap dipertahankan. Build berhasil.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Berhasil. Komponen `TombolWhatsApp` diubah: elemen `<button>` diganti menjadi `<a>` dengan `href` ke `https://wa.me/{nomorWhatsApp}?text={pesan}`, `target="_blank"`, dan `rel="noopener noreferrer"`. Pesan otomatis berisi nama produk (dicetak tebal dengan asterisk WhatsApp) dan harga dalam format rupiah. Kelas CSS tetap sama sehingga tampilan tidak berubah. Baris `CatatanBelumAktif` tentang US-03 dihapus dari `app/produk/[id]/page.jsx`. Build berhasil.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Berhasil. Tiga hal utama yang dibuat:

1. File baru `lib/supabase/admin.js` berisi fungsi `createAdminClient()` yang memakai `@supabase/ssr` dengan `SUPABASE_PUBLISHABLE_KEY` dan cookie untuk mengelola sesi.
2. File baru `app/admin/actions.js` berisi Server Action `login()` (memanggil `signInWithPassword`) dan `logout()` (memanggil `signOut` lalu redirect ke `/admin/login`).
3. Halaman login diubah menjadi Client Component (`"use client"`) yang memakai `useActionState` untuk menghubungkan form ke Server Action `login`. Pesan error ditampilkan di bawah form. Tombol menampilkan "Memproses..." saat loading.
4. `NavAdmin.jsx` diubah: tombol "Keluar" dibungkus `<form action={logout}>` sehingga memanggil Server Action logout.

`CatatanBelumAktif` dan komentar placeholder dihapus. Build berhasil.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Berhasil. Server Action `gantiPassword()` ditambahkan di `app/admin/actions.js`. Alur validasinya:

1. Cek semua field terisi → kalau kosong, kembalikan pesan error.
2. Cek panjang password minimal 8 karakter → kalau kurang, kembalikan pesan error.
3. Cek password baru sama dengan konfirmasi → kalau beda, kembalikan pesan error.
4. Cek admin sudah login dengan `supabase.auth.getUser()` → kalau belum, kembalikan pesan error.
5. Panggil `supabase.auth.updateUser({ password })` → kalau gagal, kembalikan pesan error dari Supabase; kalau berhasil, kembalikan pesan sukses.

Halaman `app/admin/password/page.jsx` diubah menjadi Client Component yang memakai `useActionState` untuk menghubungkan form ke `gantiPassword`. Pesan error tampil dengan warna merah, pesan sukses tampil dengan warna hijau. `CatatanBelumAktif` dihapus. Build berhasil.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Berhasil. File `proxy.js` dibuat di root proyek dengan fungsi `proxy(request)` dan config matcher `["/admin/:path*"]`. Alurnya:

1. Kalau rute bukan `/admin` atau rute adalah `/admin/login`, langsung lewatkan (`NextResponse.next()`).
2. Untuk rute `/admin` lainnya, buat koneksi Supabase SSR dari cookie request, lalu panggil `supabase.auth.getUser()`.
3. Kalau tidak ada user (belum login), redirect ke `/admin/login`.
4. Kalau ada user, lanjutkan request.

Server Action `gantiPassword` sudah memeriksa login di server sejak US-05 (memanggil `getUser()` sebelum mengubah password). `CatatanBelumAktif` dihapus dari `app/admin/page.jsx`. Build berhasil dan output menunjukkan `ƒ Proxy (Middleware)` aktif.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.

## Debugging dan fitur bonus

### US-11 Filter kategori atau pencarian produk [SENDIRI]

**Prompt:**
yang bagian dashboard Toko Diskuy, yang menampilkan katalog produk-produk, coba di bagusin lagi dan ada pencarian gitu untuk keinginan pengguna

**Hasil:**
Berhasil. Tampilan halaman depan/katalog Toko Diskuy (`app/page.jsx`) ditingkatkan dengan:
1. Desain banner toko yang lebih elegan, rapi, dan informatif: menampilkan badge jam operasional toko, nama usaha, tagline, serta alamat toko secara konsisten dengan sistem warna di `DESIGN.md`.
2. Dibuatkan komponen `components/KatalogProduk.jsx` yang menyediakan kolom pencarian interaktif instan (mencari berdasarkan nama, kategori, maupun deskripsi produk).
3. Tombol filter kategori dinamis (chips/pills) yang otomatis mengekstrak kategori dari data produk di database.
4. Indikator jumlah produk yang ditemukan, tombol reset filter, dan tampilan ramah saat produk yang dicari tidak ditemukan.
5. Akses database tetap terjaga aman di Server Component (`app/page.jsx`) sehingga tidak ada Supabase client di sisi browser ("use client"). Build berhasil tanpa error.

**Perbaikan:**
Tidak ada perbaikan yang diperlukan.
