"use client";
import {
  Download, Sparkles, FileText, Scan, Search, Image,
  Braces, Terminal, ArrowRight, ExternalLink, Link, Scissors
} from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { t, tList } from "@/lib/translations";

const demoKeys = [
  { icon: Image, title: "Photobox", badgeKey: "s.photobox.badge", badgeColor: "bg-purple-600 text-white", bgColor: "bg-yellow-200", descKey: "s.photobox.desc", stepsKey: "s.photobox.steps" },
  { icon: Download, title: "TikTok Downloader", badgeKey: "s.tiktok.badge", badgeColor: "bg-cyan-500 text-white", bgColor: "bg-yellow-400", descKey: "s.tiktok.desc", stepsKey: "s.tiktok.steps" },
  { icon: Sparkles, title: "Remove BG", badgeKey: "s.removebg.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-pink-500", descKey: "s.removebg.desc", stepsKey: "s.removebg.steps" },
  { icon: FileText, title: "PDF to Word", badgeKey: "s.pdftoword.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-cyan-500", descKey: "s.pdftoword.desc", stepsKey: "s.pdftoword.steps" },
  { icon: Scan, title: "OCR Text", badgeKey: "s.ocr.badge", badgeColor: "bg-black text-white", bgColor: "bg-yellow-400", descKey: "s.ocr.desc", stepsKey: "s.ocr.steps" },
  { icon: Search, title: "Jurnal Finder", badgeKey: "s.jurnal.badge", badgeColor: "bg-black text-white", bgColor: "bg-gray-50", descKey: "s.jurnal.desc", stepsKey: "s.jurnal.steps" },
  { icon: Image, title: "Picture to PDF", badgeKey: "s.pictopdf.badge", badgeColor: "bg-yellow-400 text-black", bgColor: "bg-pink-500", descKey: "s.pictopdf.desc", stepsKey: "s.pictopdf.steps" },
  { icon: Search, title: "Dorking OSINT", badgeKey: "s.dorking.badge", badgeColor: "bg-red-500 text-white", bgColor: "bg-gray-900", descKey: "s.dorking.desc", stepsKey: "s.dorking.steps" },
  { icon: Braces, title: "JSON Formatter", badgeKey: "s.json.badge", badgeColor: "bg-black text-white", bgColor: "bg-gray-100", descKey: "s.json.desc", stepsKey: "s.json.steps" },
  { icon: Terminal, title: "Markdown Previewer", badgeKey: "s.markdown.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-gray-50", descKey: "s.markdown.desc", stepsKey: "s.markdown.steps" },
  { icon: Sparkles, title: "Quote Generator", badgeKey: "s.quote.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-white", descKey: "s.quote.desc", stepsKey: "s.quote.steps" },
  { icon: Link, title: "Linktree Generator", badgeKey: "s.linktree.badge", badgeColor: "bg-green-500 text-white", bgColor: "bg-white", descKey: "s.linktree.desc", stepsKey: "s.linktree.steps" },
  { icon: Scissors, title: "Barber Kalkulator", badgeKey: "s.barber.badge", badgeColor: "bg-pink-500 text-white", bgColor: "bg-cyan-400", descKey: "s.barber.desc", stepsKey: "s.barber.steps" },
];

export default function ShowcasePage() {
  const { lang } = useLang();
  return (
    <>
      <section className="mb-16 flex flex-col items-center text-center pt-8">
        <div className="relative inline-block mb-6">
          <div className="bg-yellow-400 border-4 border-black p-8 md:p-10 comic-shadow rotate-2 transform-gpu">
            <h1 className="font-display text-headline-lg-mobile md:text-display-xl text-black uppercase leading-none">{t("showcase.title", lang)}</h1>
          </div>
          <div className="absolute -bottom-5 left-12 w-10 h-10 bg-yellow-400 border-r-4 border-b-4 border-black rotate-45 z-[-1] comic-shadow"></div>
        </div>
        <p className="max-w-2xl font-body text-body-lg text-gray-600 dark:text-gray-300">{t("showcase.subtitle", lang)}</p>
      </section>

      <div className="space-y-8">
        {demoKeys.map((demo, i) => (
          <div key={i} className={`relative comic-panel ${demo.bgColor} ${i === 4 || i === 8 ? "md:col-span-2" : ""}`}>
            <div className={`comic-badge ${demo.badgeColor}`}>{t(demo.badgeKey, lang)}</div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/5">
                <h3 className={`font-display text-headline-md uppercase italic mb-3 flex items-center gap-2 ${demo.bgColor === 'bg-gray-900' ? 'dark:text-white' : 'dark:text-gray-900'}`}>
                  <demo.icon className="w-6 h-6 shrink-0" />{demo.title}
                </h3>
                <p className="font-body text-body-md text-gray-700 dark:text-gray-300 mb-4">{t(demo.descKey, lang)}</p>
                <a href="/"
                  className="inline-flex items-center gap-2 bg-black dark:bg-gray-900 text-white border-4 border-black px-5 py-2 font-body font-bold uppercase text-sm comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                  {t("showcase.cobain", lang)} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="md:w-3/5">
                <div className="bg-white dark:bg-gray-800 border-4 border-black p-4 comic-shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(3)].map((_, j) => (<div key={j} className="w-3 h-3 border-2 border-black dark:border-gray-500" />))}
                    <div className="ml-auto font-body font-bold text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{t("showcase.demoSteps", lang)}</div>
                  </div>
                  <div className="space-y-2">
                    {tList(demo.stepsKey, lang).map((step, s) => (
                      <div key={s} className="flex items-center gap-3">
                        <span className="bg-cyan-500 text-white w-6 h-6 border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0">{s + 1}</span>
                        <span className="font-body font-bold text-sm dark:text-gray-200">{step}</span>
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
          <h2 className="font-display text-headline-lg text-white uppercase leading-tight mb-4">{t("showcase.ctaTitle", lang)}</h2>
          <p className="text-pink-200 font-body text-body-lg">{t("showcase.ctaDesc", lang)}</p>
        </div>
        <a href="/"
          className="bg-yellow-400 text-black border-4 border-black px-4 sm:px-10 py-3 sm:py-5 font-display font-black uppercase text-base sm:text-xl comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
          {t("showcase.ctaBtn", lang)} <ArrowRight className="w-6 h-6" />
        </a>
      </section>
    </>
  );
}
