import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "SocialToolsByZa!! - Alat Tempur Mahasiswa IT",
    template: "%s | SocialToolsByZa",
  },
  description: "Alat tempur kuliah, ngoding, dan ngonten terlengkap buat bertahan hidup sampai lulus! TikTok Downloader, PDF to Word, Remove Background, OCR, Jurnal Finder, dan banyak lagi.",
  keywords: ["social tools", "tiktok downloader", "pdf to word", "remove background", "ocr", "jurnal finder", "alat mahasiswa", "ngoding tools", "gen z tools"],
  authors: [{ name: "SocialToolsByZa" }],
  openGraph: {
    title: "SocialToolsByZa!! - Alat Tempur Mahasiswa IT",
    description: "9+ alat sakti buat naklukin tugas kuliah, ngoding, dan ngonten. Gratis!",
    url: "https://socialtoolsbyza.vercel.app",
    siteName: "SocialToolsByZa",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anybody:wght@800;900&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-100 text-black font-body min-h-screen">
        <AuthProvider>
          <Header />
          <main className="pt-28 md:pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
