"use client";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";

const LS_KEY = "zabot-welcome-seen";

export default function ChatWelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(LS_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const { lang } = useLang();

  const dismiss = () => {
    localStorage.setItem(LS_KEY, "1");
    setShow(false);
  };

  const openChat = () => {
    dismiss();
    window.dispatchEvent(new CustomEvent("open-zabot"));
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[998] animate-[slideUp_0.3s_ease-out] max-w-[280px] sm:max-w-[320px]">
      <div className="bg-white comic-border shadow-[4px_4px_0_#000] p-3 relative">
        <button
          onClick={dismiss}
          className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center border-2 border-black hover:scale-110 transition-transform"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-pink-500 rounded-full flex items-center justify-center shrink-0 border-2 border-black">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xs uppercase tracking-wider">{t("chatwelcome.title", lang)}</p>
            <p className="font-body text-xs mt-0.5 leading-relaxed">
              {t("chatwelcome.desc", lang)}
            </p>
            <button
              onClick={openChat}
              className="mt-2 bg-pink-500 text-white border-2 border-black px-3 py-1 font-display uppercase text-[10px] tracking-wider shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
            >
              {t("chatwelcome.btn", lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
