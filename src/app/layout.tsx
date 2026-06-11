import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import NavigationProgress from "@/components/NavigationProgress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import ThemeProvider from "@/lib/ThemeProvider";
import LangProvider from "@/lib/LangContext";
import { SearchProvider } from "@/lib/SearchContext";
import { Toaster } from "react-hot-toast";
import { inter, anybody } from "@/lib/fonts";

const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });
const ChatWelcomePopup = dynamic(() => import("@/components/ChatWelcomePopup"), { ssr: false });

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
    description: "12+ alat sakti buat naklukin tugas kuliah, ngoding, dan ngonten. Gratis!",
    url: "https://social-tools-by-za.vercel.app",
    siteName: "SocialToolsByZa",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialToolsByZa!! - Alat Tempur Mahasiswa IT",
    description: "12+ alat sakti buat naklukin tugas kuliah, ngoding, dan ngonten. Gratis!",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://social-tools-by-za.vercel.app"),
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
    <html lang="id" className={`${inter.variable} ${anybody.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: `
          try { var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.classList.add("dark"); } catch(e) {}
        ` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
        <LangProvider>
        <SearchProvider>
        <AuthProvider>
          <NavigationProgress />
          <Header />
          <main className="pt-28 md:pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
          <ChatWelcomePopup />
          <ChatBot />
        </AuthProvider>
        </SearchProvider>
        </LangProvider>
        </ThemeProvider>
        <Toaster position="top-right" toastOptions={{duration:3000,style:{background:"#111",color:"#fff",border:"2px solid #000",borderRadius:8,fontSize:13,fontWeight:600},success:{iconTheme:{primary:"#22c55e",secondary:"#fff"}},error:{iconTheme:{primary:"#ef4444",secondary:"#fff"}}}} />
      </body>
    </html>
  );
}
