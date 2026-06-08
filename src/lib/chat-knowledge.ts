interface Knowledge {
  keywords: string[];
  response: string;
}

const features = [
  {
    id: "tiktok",
    name: "TikTok Downloader",
    desc: "Download video TikTok tanpa watermark. Tinggal paste link TikTok, klik GRAB, langsung dapet videonya.",
    correct: "Paste link TikTok yang masih aktif, pastikan formatnya https://www.tiktok.com/@...",
    wrong: "Jangan paste link dari aplikasi pihak ketiga atau link yang udah kadaluarsa.",
  },
  {
    id: "removebg",
    name: "Remove Background",
    desc: "Hapus latar belakang foto otomatis pake AI. Upload foto, tunggu proses, download hasilnya.",
    correct: "Upload foto dengan objek yang jelas dan kontras sama background.",
    wrong: "Foto yang blur atau objeknya ga jelas hasilnya bakal kurang rapi.",
  },
  {
    id: "pdf2word",
    name: "PDF to Word",
    desc: "Convert PDF ke file Word (.docx). Upload PDF, server kita ekstrak teksnya jadi Word.",
    correct: "PDF dengan teks yang jelas (bukan hasil scan). Max 15MB.",
    wrong: "PDF hasil scan/ gambar ga bisa diekstrak, pake OCR dulu.",
  },
  {
    id: "ocr",
    name: "OCR Picture to Text",
    desc: "Ambil teks dari gambar pake teknologi OCR. Upload gambar yang ada tulisannya, teksnya bakal ke-extract.",
    correct: "Upload gambar dengan teks yang jelas dan kontras.",
    wrong: "Teks yang kecil, miring, atau buram hasil bacanya bakal kacau.",
  },
  {
    id: "jurnal",
    name: "Jurnal Finder",
    desc: "Cari jurnal akademik dari Google Scholar. Tinggal masukin kata kunci, muncul hasilnya lengkap sama link PDF.",
    correct: "Pake kata kunci yang spesifik biar hasilnya akurat.",
    wrong: "Kata kunci umum kayak 'pendidikan' bakal muncul banyak hasil.",
  },
  {
    id: "pic2pdf",
    name: "Picture to PDF",
    desc: "Gabung beberapa gambar jadi file PDF. Upload gambar, atur urutannya, klik download.",
    correct: "Upload file JPG atau PNG aja. Bisa multi-file.",
    wrong: "File selain JPG/PNG ga bisa diproses.",
  },
  {
    id: "dorking",
    name: "Dorking OSINT",
    desc: "Cari username di 35+ platform sosial media sekaligus. Tau apakah username lo udah dipake di mana aja.",
    correct: "Masukin username yang valid, hasilnya bakal ngecek satu per satu platform.",
    wrong: "Username general kayak 'admin' atau 'user' hasilnya kurang akurat.",
  },
  {
    id: "json",
    name: "JSON Formatter",
    desc: "Format dan validasi JSON. Tinggal paste JSON berantakan, klik RAPIHKAN, langsung rapi.",
    correct: "Paste JSON valid yang mau di-format.",
    wrong: "JSON yang syntax-nya salah bakal muncul error validasi.",
  },
  {
    id: "markdown",
    name: "Markdown Previewer",
    desc: "Tulis Markdown, lihat preview HTML langsung secara real-time. Bisa copy HTML, print PDF, dan liat jumlah karakter/kata.",
    correct: "Tulis pake syntax Markdown standar.",
    wrong: "Syntax Markdown yang salah ga bakal ke-render dengan bener.",
  },
  {
    id: "quote",
    name: "Quote Generator",
    desc: "Generate quote kocak khas Gen-Z. Bisa pake quote random atau tulis sendiri, tinggal download PNG buat story.",
    correct: "Klik tombol quote buat dapet quote random, atau tulis teks sendiri.",
    wrong: "Kosongin teks maka bakal pake quote random.",
  },
  {
    id: "linktree",
    name: "Linktree Generator",
    desc: "Buat halaman linktree pribadi dengan 15+ platform sosial media. Bisa share link atau download PNG.",
    correct: "Isi nama dan link-link lo, klik Generate, dapet link shareable.",
    wrong: "Link yang ga valid bakal error pas diakses orang.",
  },
  {
    id: "barber",
    name: "Barber Kalkulator",
    desc: "Hitung pendapatan harian barber dengan sistem bagi hasil 60:40. Hitung potong dewasa (25k), anak (20k), semir (40k), kurangi uang makan, sisanya dibagi 60% owner 40% karyawan.",
    correct: "Isi jumlah pelanggan, uang makan, hasil otomatis kalkulasi.",
    wrong: "Uang makan jangan lebih besar dari total pendapatan.",
  },
];

const generalInfo = [
  { keywords: ["fitur", "tools", "apa aja", "list", "menu", "fungsi"], response: `Berikut fitur lengkap SocialToolsByZa:\n${features.map((f, i) => `${i + 1}. **${f.name}** - ${f.desc}`).join("\n")}\n\nAda 12 tools yang siap bantu lo. Mau tau cara pake salah satu? tinggal tanya!` },
  { keywords: ["cara pake", "gimana cara", "tutorial", "petunjuk", "guide", "usage"], response: `Mau tau cara pake tools yang mana? Coba sebutin nama toolsnya:\n${features.map((f) => `- ${f.name}`).join("\n")}\n\nContoh: "Cara pake TikTok Downloader"` },
  { keywords: ["siapa", "pembuat", "creator", "author", "about"], response: "SocialToolsByZa dibuat oleh Za. Tools ini dibuat buat bantu mahasiswa IT bertahan hidup sampe lulus 😎" },
  { keywords: ["login", "daftar", "register", "akun", "sign", "masuk"], response: "Buat pake tools-nya, lo perlu login dulu. Kalo belum punya akun, bisa kontak admin lewat Instagram atau WhatsApp buat minta akses. Admin: @popify_dev (IG) atau link WA di footer." },
  { keywords: ["premium", "bayar", "harga", "berbayar", "gratis"], response: "Semua tools di sini **GRATIS** buat yang udah login. Ga ada biaya apapun. Kalo lo belum punya akun, tinggal hubungi admin aja." },
  { keywords: ["kontak", "admin", "bantuan", "help", "cs"], response: "Kalo butuh bantuan atau mau lapor bug, bisa hubungi:\n- Instagram: @popify_dev\n- Threads: @popify_dev\n- WhatsApp: ada di footer website" },
  { keywords: ["password", "lupa", "reset"], response: "Kalo lupa password, lo bisa hubungi admin lewat Instagram @popify_dev atau WhatsApp yang ada di footer buat minta reset." },
];

export function findLocalResponse(message: string): string | null {
  const lower = message.toLowerCase();
  for (const info of generalInfo) {
    if (info.keywords.some((kw) => lower.includes(kw))) {
      return info.response;
    }
  }
  for (const f of features) {
    if (lower.includes(f.id) || lower.includes(f.name.toLowerCase())) {
      if (lower.includes("cara") || lower.includes("gimana") || lower.includes("tutorial") || lower.includes("petunjuk") || lower.includes("pake")) {
        return `**${f.name}**\n${f.desc}\n\n✅ *Cara bener:* ${f.correct}\n❌ *Yang salah:* ${f.wrong}`;
      }
      return `**${f.name}**\n${f.desc}\n\n✅ *Cara bener:* ${f.correct}\n❌ *Yang salah:* ${f.wrong}`;
    }
  }
  return null;
}

export const QUICK_PROMPTS = [
  { label: "📋 Daftar Fitur", text: "Apa aja fitur yang tersedia?" },
  { label: "🎵 Cara TikTok", text: "Cara pake TikTok Downloader" },
  { label: "📄 Cara PDF to Word", text: "Cara pake PDF to Word" },
  { label: "🔍 Cara Jurnal Finder", text: "Cara pake Jurnal Finder" },
  { label: "💈 Cara Barber Kalkulator", text: "Cara pake Barber Kalkulator" },
  { label: "🔗 Cara Linktree", text: "Cara pake Linktree Generator" },
];

export const FEATURE_LIST = features
  .map((f) => `- ${f.name}: ${f.desc}`)
  .join("\n");
