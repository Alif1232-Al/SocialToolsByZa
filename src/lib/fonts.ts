import { Inter, Anybody } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

export const anybody = Anybody({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
  variable: "--font-display",
});
