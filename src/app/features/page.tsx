"use client";
import {
  Download, Sparkles, FileText, Scan, Search, Image,
  Braces, Terminal, MessageCircle, Link, Scissors, ArrowRight, Check
} from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { t, tList } from "@/lib/translations";

const featKeys = [
  { icon: Image, titleKey: "f.photobox", badgeKey: "f.photobox.badge", badgeColor: "bg-purple-600 text-white", bgColor: "bg-yellow-200", descKey: "f.photobox.desc", hlKey: "f.photobox.hl" },
  { icon: Download, titleKey: "f.tiktok", badgeKey: "f.tiktok.badge", badgeColor: "bg-cyan-500 text-white", bgColor: "bg-yellow-400", descKey: "f.tiktok.desc", hlKey: "f.tiktok.hl" },
  { icon: Sparkles, titleKey: "f.removebg", badgeKey: "f.removebg.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-pink-500", descKey: "f.removebg.desc", hlKey: "f.removebg.hl" },
  { icon: FileText, titleKey: "f.pdftoword", badgeKey: "f.pdftoword.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-cyan-500", descKey: "f.pdftoword.desc", hlKey: "f.pdftoword.hl" },
  { icon: Scan, titleKey: "f.ocr", badgeKey: "f.ocr.badge", badgeColor: "bg-black text-white", bgColor: "bg-yellow-400", descKey: "f.ocr.desc", hlKey: "f.ocr.hl" },
  { icon: Search, titleKey: "f.jurnal", badgeKey: "f.jurnal.badge", badgeColor: "bg-black text-white", bgColor: "bg-gray-50", descKey: "f.jurnal.desc", hlKey: "f.jurnal.hl" },
  { icon: Image, titleKey: "f.pictopdf", badgeKey: "f.pictopdf.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-pink-500", descKey: "f.pictopdf.desc", hlKey: "f.pictopdf.hl" },
  { icon: Search, titleKey: "f.dorking", badgeKey: "f.dorking.badge", badgeColor: "bg-red-500 text-white", bgColor: "bg-gray-900", descKey: "f.dorking.desc", hlKey: "f.dorking.hl" },
  { icon: Braces, titleKey: "f.json", badgeKey: "f.json.badge", badgeColor: "bg-black text-white", bgColor: "bg-gray-100", descKey: "f.json.desc", hlKey: "f.json.hl" },
  { icon: Terminal, titleKey: "f.markdown", badgeKey: "f.markdown.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-gray-50", descKey: "f.markdown.desc", hlKey: "f.markdown.hl" },
  { icon: MessageCircle, titleKey: "f.sosmed", badgeKey: "f.sosmed.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-white", descKey: "f.sosmed.desc", hlKey: "f.sosmed.hl" },
  { icon: Sparkles, titleKey: "f.quote", badgeKey: "f.quote.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-white", descKey: "f.quote.desc", hlKey: "f.quote.hl" },
  { icon: Link, titleKey: "f.linktree", badgeKey: "f.linktree.badge", badgeColor: "bg-green-500 text-white", bgColor: "bg-white", descKey: "f.linktree.desc", hlKey: "f.linktree.hl" },
  { icon: Scissors, titleKey: "f.barber", badgeKey: "f.barber.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-cyan-400", descKey: "f.barber.desc", hlKey: "f.barber.hl" },
];

export default function FeaturesPage() {
  const { lang } = useLang();
  return (
    <>
      <section className="mb-16 flex flex-col items-center text-center pt-8">
        <div className="relative inline-block mb-6">
          <div className="bg-pink-500 border-4 border-black p-8 md:p-10 comic-shadow -rotate-1 transform-gpu">
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-white uppercase leading-none">
              {t("features.title", lang)}
            </h1>
          </div>
          <div className="absolute -bottom-5 left-12 w-10 h-10 bg-pink-500 border-r-4 border-b-4 border-black rotate-45 z-[-1] comic-shadow"></div>
        </div>
        <p className="max-w-2xl font-body text-body-lg text-gray-600 dark:text-gray-300">
          {t("features.subtitle", lang)}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featKeys.map((f, i) => (
          <div key={i}
            className={`relative comic-panel ${f.bgColor} ${i === 4 || i === 8 ? "md:col-span-2" : ""}`}>
            <div className={`comic-badge ${f.badgeColor}`}>{t(f.badgeKey, lang)}</div>
            <h3 className={`font-display text-headline-md uppercase italic mb-4 flex items-center gap-2 break-words ${f.bgColor === 'bg-gray-900' ? 'dark:text-white' : 'dark:text-gray-900'}`}>
              <f.icon className="w-6 h-6 shrink-0" />
              <span className="min-w-0">{t(f.titleKey, lang)}</span>
            </h3>
            <p className="font-body text-body-md text-gray-700 dark:text-gray-300 mb-6 flex-grow break-words">
              {t(f.descKey, lang)}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {tList(f.hlKey, lang).map((h) => (
                <span key={h} className="bg-white dark:bg-gray-700 border-2 border-black px-3 py-1 font-body font-bold text-xs flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />{h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-24 bg-cyan-500 border-4 border-black p-6 md:p-12 comic-shadow flex flex-col md:flex-row items-center justify-between gap-8 rotate-1">
        <div className="md:w-1/2">
          <h2 className="font-display text-headline-lg text-white uppercase leading-tight mb-4">{t("features.ctaTitle", lang)}</h2>
          <p className="text-cyan-100 font-body text-body-lg">{t("features.ctaDesc", lang)}</p>
        </div>
        <a href="/"
          className="bg-yellow-400 text-black border-4 border-black px-4 sm:px-10 py-3 sm:py-5 font-display font-black uppercase text-base sm:text-xl comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
          {t("features.ctaBtn", lang)} <ArrowRight className="w-6 h-6" />
        </a>
      </section>
    </>
  );
}
