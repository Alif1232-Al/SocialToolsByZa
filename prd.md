================================================================================
PRODUCT REQUIREMENT DOCUMENT (PRD) - FULL SYSTEM & DESIGN
================================================================================
Project Name: SocialToolsByZa  
Target Platform: Vercel (100% Serverless / Client-side optimized)  
Tech Stack: Next.js (App Router), Tailwind CSS, TypeScript, Lucide React (Icons)  
Design Style: Neo-Brutalisme / Comic Book Pop Art Style 

--------------------------------------------------------------------------------
1. RINGKASAN PRODUK
--------------------------------------------------------------------------------
SocialToolsByZa adalah platform web utility all-in-one yang menggabungkan alat produktivitas media sosial, akademik, dan developer utilities ke dalam satu antarmuka bertema komik pop art. Aplikasi dirancang se-efisien mungkin menggunakan pemrosesan client-side (di browser) dan Vercel Serverless Functions agar tidak membebani limit performa tier gratis Vercel.

--------------------------------------------------------------------------------
2. PANDUAN VISUAL KOMIK & TAILWIND CSS CONFIG
--------------------------------------------------------------------------------
Kamu wajib mematuhi arsitektur UI Neo-Brutalisme berikut untuk setiap komponen:
* The Comic Border: Semua box panel, tombol, dan input field wajib memakai `border-4 border-black`.
* The Hard Shadow: Menggunakan bayangan tegas tanpa blur: `shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`.
* The Click Effect (Hover): Efek tombol amblas saat ditekan: `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all`.
* Warna Utama: 
  - Kuning Komik: #FACC15 (`bg-yellow-400`)
  - Cyan Splash: #06B6D4 (`bg-cyan-500`)
  - Comic Pink: #EC4899 (`bg-pink-500`)
  - Base Gray: #F3F4F6 (`bg-gray-100`)

--------------------------------------------------------------------------------
3. SPESIFIKASI 10 FITUR UTAMA (SISTEM & UI)
--------------------------------------------------------------------------------

[PANEL 1] TikTok Video Downloader (Fitur 1)
* Sistem: Mengirimkan URL ke Next.js API Route (`/api/tiktok`) -> Fetch ke API publik gratis (seperti TikWM atau RapidAPI) -> Mengembalkan link video tanpa watermark.
* UI Komik: Box `bg-yellow-400`, badge atas bertuliskan "BOOM!". Input bar putih bersih, tombol unduh bertuliskan "GRAB VIDEO!".

[PANEL 2] Remove Background Image (Fitur 2)
* Sistem: Pemrosesan 100% di browser menggunakan library `@imgly/background-removal` berbasis WebAssembly (WASM) agar hemat resource server Vercel.
* UI Komik: Box `bg-pink-500`, badge atas "ZAP!". Area drop-zone gambar ber-border putus-putus hitam tebal. Output gambar .png transparan langsung muncul di frame ala potongan komik.

[PANEL 3] PDF to Word Converter (Fitur 3)
* Sistem: Menggunakan library `pdf-parse` untuk mengekstrak string teks dari file PDF, kemudian dikemas ulang menjadi struktur file .docx menggunakan library `docx`.
* UI Komik: Box `bg-cyan-500`, badge atas "CONVERT!". Tombol eksekusi besar berwarna kuning kontras dengan teks "MAKE IT WORD!".

[PANEL 4] OCR Picture to Text (Fitur 4)
* Sistem: Pemrosesan client-side menggunakan `tesseract.js` melalui Web Workers agar browser tetap responsif saat membaca teks pada gambar.
* UI Komik: Box `bg-yellow-400`, badge atas "SCAN!". Menggunakan Split Panel (Kiri: Area upload gambar, Kanan: <textarea> hasil teks dengan tombol "COPY TEXT!").

[PANEL 5] Jurnal Finder / Google Scholar (Fitur 5)
* Sistem: Next.js API Route (`/api/jurnal`) bertindak sebagai proxy pencarian menggunakan SerpAPI (Google Scholar API) untuk menghindari blocking IP oleh Google.
* UI Komik: Box berukuran lebar (`md:col-span-2`), background `bg-gray-50`, badge atas "SEARCH!". Hasil pencarian berupa list kartu ber-border tebal berisi judul jurnal, penulis, abstrak, dan tombol "GO TO PDF".

[PANEL 6] Picture to PDF Converter (Fitur 6)
* Sistem: Pemrosesan murni di browser menggunakan library `jspdf`. Mengonversi multipel gambar (JPEG/PNG) ke dalam halaman PDF berukuran A4 secara proporsional.
* UI Komik: Box `bg-pink-500`, badge atas "ZIP!". Menampilkan grid thumbnail image preview kecil sebelum di-convert, dengan tombol aksi "GENERATE PDF!".

[PANEL 7] YouTube to MP3 Downloader (Fitur 7)
* Sistem: Frontend melakukan post request ke Next.js API Route -> Menjembatani konversi via pihak ketiga (RapidAPI YouTube Converter) untuk menghasilkan link download file .mp3.
* UI Komik: Box `bg-cyan-500`, badge atas "POW!". Form input link YouTube ber-border tebal dengan tombol konversi merah menyala bertuliskan "CONVERT AUDIO!".

[PANEL 8] Developer Tool - JSON Formatter & Validator (Fitur 8)
* Sistem: Logic JavaScript client-side: `JSON.parse()` untuk validasi dan `JSON.stringify(data, null, 2)` untuk formatting data. Dilengkapi dengan try-catch error handling yang presisi jika JSON rusak.
* UI Komik: Box `bg-gray-100`, badge atas "CODE!". Kolom teks area besar dengan placeholder bernada jenaka mahasiswa TI (Contoh: `{"status": "stres_semester_6"}`).

[PANEL 9] Developer Tool - Markdown to HTML/PDF Previewer (Fitur 9)
* Sistem: Menggunakan library `marked` untuk melakukan parsing teks Markdown ke HTML secara real-time (live preview). Ditambah fitur cetak langsung ke dokumen menggunakan browser print layout atau `html2pdf.js`.
* UI Komik: Box melebar (`md:col-span-2`). Sisi kiri tempat mengetik kode Markdown, sisi kanan adalah panel live preview HTML bergaya halaman buku komik.

[PANEL 10] Social Media Hub & WA Widget (Fitur 10)
* Sistem: Komponen statis berisi kumpulan link eksternal aktif yang mengarah ke profil profesional pemilik web. Khusus WhatsApp, menggunakan link generator https://wa.me/ dengan pre-filled text otomatis.
* UI Komik: Berada di area paling bawah (Footer) bernama "THE CREW / CONTACT ME". Icon media sosial (Instagram, Threads, LinkedIn, Kaggle, WhatsApp) dibungkus lingkaran hitam tebal `border-4 border-black rounded-full` yang akan membesar (scale-up) saat di-hover.

--------------------------------------------------------------------------------
4. INSTRUKSI OUTPUT KODE UNTUK DEEPSEEK
--------------------------------------------------------------------------------
1. Buatkan struktur folder Next.js App Router yang bersih menggunakan TypeScript.
2. Tulis kode file `tailwind.config.js` yang sudah dikonfigurasi untuk menangani hard shadow retro komik (`shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`).
3. Berikan kode halaman utama `app/page.tsx` yang menyusun seluruh panel fitur di atas ke dalam layout `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` seolah-olah seperti membaca halaman buku komik.
4. Sertakan command instalasi untuk semua library pendukung yang dibutuhkan (`tesseract.js`, `jspdf`, `marked`, `pdf-parse`, `docx`).

Tolong buatkan kodenya sekarang dengan sangat detail dan siap pakai!