"use client";
import { useLang } from "@/lib/LangContext";

export default function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <button onClick={toggle}
      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black rounded-lg bg-white dark:bg-gray-700 text-[10px] sm:text-xs font-black font-display hover:bg-gray-100 dark:hover:bg-gray-600 transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
      title={lang === "id" ? "English" : "Indonesia"}
      aria-label="Toggle language">
      <span className={lang === "id" ? "text-blue-600" : "text-red-500"}>
        {lang === "id" ? "EN" : "ID"}
      </span>
    </button>
  );
}
