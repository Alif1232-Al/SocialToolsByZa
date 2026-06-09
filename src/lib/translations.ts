export type Lang = "id" | "en";

const translations: Record<string, { id: string; en: string }> = {
  "nav.tools": { id: "Tools", en: "Tools" },
  "nav.features": { id: "Features", en: "Features" },
  "nav.showcase": { id: "Showcase", en: "Showcase" },
  "nav.admin": { id: "Admin", en: "Admin" },
  "nav.login": { id: "Login", en: "Login" },
  "nav.logout": { id: "Logout", en: "Logout" },
  "nav.getStarted": { id: "GET STARTED", en: "GET STARTED" },
  "nav.loggedInAs": { id: "Logged in as", en: "Logged in as" },

  "hero.title": { id: "SOCIAL TOOLS BY ZA!!", en: "SOCIAL TOOLS BY ZA!!" },
  "hero.tagline": { id: "Alat tempur kuliah, ngoding, dan ngonten terlengkap buat bertahan hidup sampai lulus!", en: "The ultimate toolkit for surviving college, coding, and content creation!" },
  "hero.tag1": { id: "#Semester6Survival", en: "#Semester6Survival" },
  "hero.tag2": { id: "#NoDebtNoStress", en: "#NoDebtNoStress" },
  "hero.tag3": { id: "#FullComicMode", en: "#FullComicMode" },

  "footer.title": { id: "THE CREW / CONTACT ME", en: "THE CREW / CONTACT ME" },
  "footer.desc": { id: "Punya pertanyaan, kritik, atau pengen ngopi bareng? Temuin gue di sosmed bawah ini!", en: "Questions, feedback, or wanna grab coffee? Find me on socials below!" },
  "footer.terms": { id: "Syarat", en: "Terms" },
  "footer.privacy": { id: "Privasi", en: "Privacy" },
  "footer.contact": { id: "Kontak", en: "Contact" },
  "footer.copyright": { id: "LETTER TO THE EDITOR:", en: "LETTER TO THE EDITOR:" },

  "lang.toggle": { id: "EN", en: "ID" },

  "subtools.photobox": { id: "Photobox Comic Studio", en: "Photobox Comic Studio" },
  "subtools.photoboxDesc": { id: "Upload foto, pilih layout & filter komik, download collage", en: "Upload photos, pick layouts & comic filters, download collage" },
  "subtools.jurnal": { id: "Jurnal Finder", en: "Jurnal Finder" },
  "subtools.jurnalDesc": { id: "Cari jurnal akademik dari Google Scholar", en: "Search academic journals from Google Scholar" },
  "subtools.markdown": { id: "Markdown Previewer", en: "Markdown Previewer" },
  "subtools.markdownDesc": { id: "Tulis Markdown, lihat preview HTML real-time", en: "Write Markdown, see real-time HTML preview" },
  "subtools.linktree": { id: "Linktree Generator", en: "Linktree Generator" },
  "subtools.linktreeDesc": { id: "Buat halaman linktree pribadi aesthetic", en: "Create your own aesthetic linktree page" },

  "home.subtools": { id: "FULL PAGE", en: "FULL PAGE" },
  "home.open": { id: "BUKA →", en: "OPEN →" },
};

export function t(key: string, lang: Lang): string {
  if (translations[key]) return translations[key][lang];
  return key;
}

export function useTranslations(lang: Lang) {
  return (key: string) => t(key, lang);
}

export default translations;
