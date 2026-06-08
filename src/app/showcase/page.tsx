import type { Metadata } from "next";
import {
  Download, Sparkles, FileText, Scan, Search, Image, Music,
  Braces, Terminal, Star, ArrowRight, ExternalLink, Link, Scissors
} from "lucide-react";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Lihat demo cara pakai setiap tools di SocialToolsByZa. Ikuti langkah-langkahnya!",
};

const demos = [
  {
    icon: Download,
    title: "TikTok Downloader",
    badge: "BOOM!",
    badgeColor: "bg-cyan-500 text-white",
    bgColor: "bg-yellow-400",
    desc: "Paste link TikTok, klik GRAB, langsung dapet video tanpa watermark.",
    steps: ["Copy TikTok video URL", "Paste di input field", "Klik GRAB VIDEO!", "Download hasilnya"],
  },
  {
    icon: Sparkles,
    title: "Remove BG",
    badge: "ZAP!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-pink-500",
    desc: "Upload gambar, AI langsung hapus background. Hasil PNG transparan siap download.",
    steps: ["Upload gambar", "Klik REMOVE BG", "Preview hasil", "Download PNG"],
  },
  {
    icon: FileText,
    title: "PDF to Word",
    badge: "CONVERT!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-cyan-500",
    desc: "Upload PDF, convert ke Word dengan server-side processing. File .docx langsung terdownload.",
    steps: ["Pilih file PDF", "Upload ke server", "Proses ekstraksi teks", "Download .docx"],
  },
  {
    icon: Scan,
    title: "OCR Text",
    badge: "SCAN!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-yellow-400",
    desc: "Upload gambar berisi teks, Tesseract.js di browser bakal scan dan extract teksnya.",
    steps: ["Upload gambar", "Klik SCAN!", "Tunggu OCR process", "Copy hasil teks"],
  },
  {
    icon: Search,
    title: "Jurnal Finder",
    badge: "SEARCH!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-gray-50",
    desc: "Cari jurnal akademik dari Google Scholar. Hasil berupa kartu dengan link PDF.",
    steps: ["Ketik kata kunci", "Klik Cari Jurnal", "Lihat hasil kartu", "Klik GO TO PDF"],
  },
  {
    icon: Image,
    title: "Picture to PDF",
    badge: "ZIP!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-pink-500",
    desc: "Pilih banyak gambar, atur urutannya, generate PDF A4. Semua di browser!",
    steps: ["Pilih multi-file gambar", "Lihat preview grid", "Klik GENERATE PDF!", "File siap diunduh"],
  },
  {
    icon: Search,
    title: "Dorking OSINT",
    badge: "DORK!",
    badgeColor: "bg-red-500 text-white",
    bgColor: "bg-gray-900",
    desc: "Cari username di 35+ social media. Temukan jejak digital seseorang dengan cepat!",
    steps: ["Masukkan username", "Klik DORK NOW!", "Scan 35+ platforms", "Lihat hasil found"],
  },
  {
    icon: Braces,
    title: "JSON Formatter",
    badge: "CODE!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-gray-100",
    desc: "Tempel JSON berantakan, klik RAPIHKAN, langsung terformat rapi dengan indentasi.",
    steps: ["Paste JSON", "Klik RAPIHKAN!", "Validasi otomatis", "Copy hasil"],
  },
  {
    icon: Terminal,
    title: "Markdown Previewer",
    badge: "ZAP!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-gray-50",
    desc: "Tulis Markdown di kiri, lihat HTML preview real-time di kanan. Bisa print PDF juga!",
    steps: ["Tulis Markdown", "Preview real-time", "Copy HTML", "Print PDF"],
  },
  {
    icon: Sparkles,
    title: "Quote Generator",
    badge: "QUOTE!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-white",
    desc: "Bikin quote kocak anak gen z siap upload. Random quote langsung jadi gambar 1:1 buat story/feed IG!",
    steps: ["Klik ACKAHIN! buat quote random", "Edit sendiri kalo mau", "Klik DOWNLOAD", "Upload ke story/feed"],
  },
  {
    icon: Link,
    title: "Linktree Generator",
    badge: "TREE!",
    badgeColor: "bg-green-500 text-white",
    bgColor: "bg-white",
    desc: "Bikin halaman linktree lo sendiri. Tambahin semua sosial media, generate link buat bio IG atau download PNG",
    steps: ["Isi nama kamu", "Tambah link sosial media", "Klik GENERATE LINK", "Copy & paste di bio IG"],
  },
  {
    icon: Scissors,
    title: "Barber Kalkulator",
    badge: "HITUNG!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-cyan-400",
    desc: "Hitung pendapatan harian barber dengan sistem bagi hasil 60:40. Bisa atur potongan uang makan karyawan!",
    steps: ["Isi jumlah potong dewasa", "Isi jumlah potong anak", "Isi jumlah semir", "Atur uang makan, lihat hasil bersih"],
  },
];

export default function ShowcasePage() {
  return (
    <>
      <section className="mb-16 flex flex-col items-center text-center pt-8">
        <div className="relative inline-block mb-6">
          <div className="bg-yellow-400 border-4 border-black p-8 md:p-10 comic-shadow rotate-2 transform-gpu">
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-black uppercase leading-none">
              SHOWCASE!!
            </h1>
          </div>
          <div className="absolute -bottom-5 left-12 w-10 h-10 bg-yellow-400 border-r-4 border-b-4 border-black rotate-45 z-[-1] comic-shadow"></div>
        </div>
        <p className="max-w-2xl font-body text-body-lg text-gray-600">
          Lihat gimana cara kerja setiap tools. Tinggal ikutin langkah-langkahnya!
        </p>
      </section>

      <div className="space-y-8">
        {demos.map((demo, i) => (
          <div
            key={i}
            className={`relative comic-panel ${demo.bgColor} ${i === 4 || i === 8 ? "md:col-span-2" : ""}`}
          >
            <div className={`comic-badge ${demo.badgeColor}`}>
              {demo.badge}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/5">
                <h3 className="font-display text-headline-md uppercase italic mb-3 flex items-center gap-2">
                  <demo.icon className="w-6 h-6 shrink-0" />
                  {demo.title}
                </h3>
                <p className="font-body text-body-md text-gray-700 mb-4">
                  {demo.desc}
                </p>

                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-black text-white border-4 border-black px-5 py-2 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  COBAIN <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="md:w-3/5">
                <div className="bg-white border-4 border-black p-4 comic-shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-3 h-3 border-2 border-black" />
                    ))}
                    <div className="ml-auto font-body font-bold text-[10px] uppercase tracking-wider text-gray-400">
                      Demo Steps
                    </div>
                  </div>
                  <div className="space-y-2">
                    {demo.steps.map((step, s) => (
                      <div key={s} className="flex items-center gap-3">
                        <span className="bg-cyan-500 text-white w-6 h-6 border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0">
                          {s + 1}
                        </span>
                        <span className="font-body font-bold text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-24 bg-pink-500 border-4 border-black p-6 md:p-12 comic-shadow flex flex-col md:flex-row items-center justify-between gap-8 -rotate-1">
        <div className="md:w-1/2">
          <h2 className="font-display text-headline-lg text-white uppercase leading-tight mb-4">
            YOUR TURN NOW!
          </h2>
          <p className="text-pink-200 font-body text-body-lg">
            Semua tools siap dipake. Langsung aja cobain!
          </p>
        </div>
        <a
          href="/"
          className="bg-yellow-400 text-black border-4 border-black px-4 sm:px-10 py-3 sm:py-5 font-display font-black uppercase text-base sm:text-xl comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
          MULAI SEKARANG <ArrowRight className="w-6 h-6" />
        </a>
      </section>
    </>
  );
}
