import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "SocialToolsByZa!! - Alat Tempur Mahasiswa IT",
  description: "Alat tempur kuliah, ngoding, dan ngonten terlengkap buat bertahan hidup sampai lulus!",
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
