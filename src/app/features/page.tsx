import type { Metadata } from "next";
import {
  Download, Sparkles, FileText, Scan, Search, Image, Music,
  Braces, Terminal, MessageCircle, Link, Scissors, ArrowRight, Check, Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Lihat semua fitur SocialToolsByZa: TikTok Downloader, Remove Background, PDF to Word, OCR, Jurnal Finder, dan banyak lagi!",
};

const features = [
  {
    icon: Image,
    title: "Photobox Comic Studio",
    badge: "BOOTH!",
    badgeColor: "bg-purple-600 text-white",
    bgColor: "bg-yellow-200",
    desc: "Upload 1-6 foto, pilih layout komik, aplikasikan 12+ filter unik (Pop Art, Comic, Halftone, Sketch, dll), download hasilnya sebagai PNG.",
    highlights: ["12+ efek filter", "6 layout grid", "Comic-style", "Canvas-based"],
  },
  {
    icon: Download,
    title: "TikTok Video Downloader",
    badge: "BOOM!",
    badgeColor: "bg-cyan-500 text-white",
    bgColor: "bg-yellow-400",
    desc: "Sedot video TikTok tanpa watermark. Cukup paste link, klik GRAB, dan video siap diunduh.",
    highlights: ["No watermark", "HD quality", "Free forever"],
  },
  {
    icon: Sparkles,
    title: "Remove Background Image",
    badge: "ZAP!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-pink-500",
    desc: "Hapus latar belakang gambar otomatis 100% di browser pake AI. Privasi terjamin!",
    highlights: ["AI-powered", "100% client-side", "PNG transparent"],
  },
  {
    icon: FileText,
    title: "PDF to Word Converter",
    badge: "CONVERT!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-cyan-500",
    desc: "Konversi file PDF ke dokumen Word (.docx) dengan format rapi. Tinggal upload dan convert!",
    highlights: ["Server-side processing", "Preserves text", "Fast conversion"],
  },
  {
    icon: Scan,
    title: "OCR Picture to Text",
    badge: "SCAN!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-yellow-400",
    desc: "Ekstrak teks dari gambar pake teknologi OCR di browser. Scanning SIM/KTP jadi mudah!",
    highlights: ["Tesseract.js engine", "Multi-language", "Client-side"],
  },
  {
    icon: Search,
    title: "Jurnal Finder / Google Scholar",
    badge: "SEARCH!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-gray-50",
    desc: "Cari jurnal akademik dari Google Scholar langsung. Dapatkan link PDF jurnal terpercaya!",
    highlights: ["Google Scholar API", "PDF links", "Academic search"],
  },
  {
    icon: Image,
    title: "Picture to PDF Converter",
    badge: "ZIP!",
    badgeColor: "bg-yellow-400 text-black",
    bgColor: "bg-pink-500",
    desc: "Gabungin banyak gambar JPG/PNG jadi satu file PDF ukuran A4. Multi-file support!",
    highlights: ["Multi-file", "A4 format", "Client-side"],
  },
  {
    icon: Search,
    title: "Dorking OSINT Search",
    badge: "DORK!",
    badgeColor: "bg-red-500 text-white",
    bgColor: "bg-gray-900",
    desc: "Lacak username di 35+ social media. OSINT tool buat riset digital footprint!",
    highlights: ["35+ platforms", "Username search", "OSINT tool"],
  },
  {
    icon: Braces,
    title: "JSON Formatter & Validator",
    badge: "CODE!",
    badgeColor: "bg-black text-white",
    bgColor: "bg-gray-100",
    desc: "Rapihin dan validasi JSON langsung di browser. Debugging API jadi lebih gampang!",
    highlights: ["Real-time validation", "Auto-format", "Copy output"],
  },
  {
    icon: Terminal,
    title: "Markdown Previewer",
    badge: "ZAP!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-gray-50",
    desc: "Tulis catatan pake Markdown, liat hasil live preview. Plus export ke HTML/PDF!",
    highlights: ["Live preview", "Copy HTML", "Print to PDF"],
  },
  {
    icon: MessageCircle,
    title: "Social Media Hub & Contact",
    badge: "CREW!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-white",
    desc: "Temukan semua link sosial media: Instagram, Threads, LinkedIn, Kaggle, WhatsApp.",
    highlights: ["All links", "WhatsApp chat", "Connect easily"],
  },
  {
    icon: Sparkles,
    title: "Quote Generator",
    badge: "QUOTE!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-white",
    desc: "Bikin quote kocak anak gen z buat story/feed IG. Random quote atau tulis sendiri, langsung jadi gambar!",
    highlights: ["30+ random quotes", "Editable text", "Download PNG"],
  },
  {
    icon: Link,
    title: "Linktree Generator",
    badge: "TREE!",
    badgeColor: "bg-green-500 text-white",
    bgColor: "bg-white",
    desc: "Buat linktree keren buat bio IG. Tambahin semua sosial media lo, generate link atau download PNG!",
    highlights: ["15+ platforms", "Shareable link", "Download PNG"],
  },
  {
    icon: Scissors,
    title: "Barber Kalkulator",
    badge: "HITUNG!",
    badgeColor: "bg-pink-500 text-white",
    bgColor: "bg-cyan-400",
    desc: "Hitung pendapatan harian barber. Sistem bagi hasil 60:40 + potong uang makan karyawan. Isi jumlah pelanggan, langsung keluar!",
    highlights: ["Potong Dewasa 25k", "Potong Anak 20k", "Uang Makan 25k"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="mb-16 flex flex-col items-center text-center pt-8">
        <div className="relative inline-block mb-6">
          <div className="bg-pink-500 border-4 border-black p-8 md:p-10 comic-shadow -rotate-1 transform-gpu">
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-white uppercase leading-none">
              ALL FEATURES!!
            </h1>
          </div>
          <div className="absolute -bottom-5 left-12 w-10 h-10 bg-pink-500 border-r-4 border-b-4 border-black rotate-45 z-[-1] comic-shadow"></div>
        </div>
        <p className="max-w-2xl font-body text-body-lg text-gray-600 dark:text-gray-300">
          13 alat sakti buat naklukin tugas kuliah, ngoding, dan ngonten. Satu web, semua beres!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className={`relative comic-panel ${f.bgColor} ${i === 4 || i === 8 ? "md:col-span-2" : ""}`}
          >
            <div className={`comic-badge ${f.badgeColor}`}>
              {f.badge}
            </div>

            <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 break-words">
              <f.icon className="w-6 h-6 shrink-0" />
              <span className="min-w-0">{f.title}</span>
            </h3>
            <p className="font-body text-body-md text-gray-700 dark:text-gray-300 mb-6 flex-grow break-words">
              {f.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {f.highlights.map((h) => (
                <span
                  key={h}
                  className="bg-white dark:bg-gray-700 border-2 border-black px-3 py-1 font-body font-bold text-xs flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-green-600" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-24 bg-cyan-500 border-4 border-black p-6 md:p-12 comic-shadow flex flex-col md:flex-row items-center justify-between gap-8 rotate-1">
        <div className="md:w-1/2">
          <h2 className="font-display text-headline-lg text-white uppercase leading-tight mb-4">
            SIAP MENJADI LEGENDS?
          </h2>
          <p className="text-cyan-100 font-body text-body-lg">
            Cobain semua tools sekarang juga. Gratis, cepat, dan gampang!
          </p>
        </div>
        <a
          href="/"
          className="bg-yellow-400 text-black border-4 border-black px-4 sm:px-10 py-3 sm:py-5 font-display font-black uppercase text-base sm:text-xl comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
          COBAIN SEKARANG <ArrowRight className="w-6 h-6" />
        </a>
      </section>
    </>
  );
}
