"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { features } from "@/lib/chat-knowledge";

type View = "menu" | "features" | "detail" | "chat";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Btn {
  label: string;
  action: string;
}

const MENU_BTNS: Btn[][] = [
  [{ label: "📋 Semua Fitur", action: "show_features" }, { label: "❓ Cara Pakai", action: "show_usage" }],
  [{ label: "💬 Ngobrol", action: "start_chat" }, { label: "ℹ️ Tentang", action: "show_about" }],
];

const WELCOME = "Halo! Aku ZA-BOT 🤖\nPilih menu di bawah atau ketik langsung pesan lo!";

function featureBtn(f: typeof features[number]): Btn {
  return { label: f.name, action: `feature:${f.id}` };
}

function chunkFeatures(arr: Btn[], size: number): Btn[][] {
  const res: Btn[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

function getFeatureById(id: string) {
  return features.find((f) => f.id === id);
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [detailId, setDetailId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-zabot", handler);
    return () => window.removeEventListener("open-zabot", handler);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, view]);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
  }, [view]);

  const addBotMsg = (text: string) => setMsgs((p) => [...p, { role: "assistant", content: text }]);

  const processAction = async (action: string) => {
    if (action === "show_features") {
      setView("features");
      addBotMsg("Pilih fitur yang mau lo liat:");
    } else if (action === "show_usage") {
      setView("features");
      addBotMsg("Pilih fitur, gua kasi tau cara pakenya:");
    } else if (action === "show_about") {
      setView("menu");
      addBotMsg("SocialToolsByZa dibuat oleh Za. 12 tools gratis buat bantu mahasiswa IT bertahan hidup sampe lulus 😎\n\nInstagram: @popify_dev");
    } else if (action === "start_chat") {
      setView("chat");
      addBotMsg("Oke, mode ngobrol! Tulis aja apa yang mau lo tanyain 👍");
    } else if (action === "back_menu") {
      setView("menu");
      setDetailId(null);
    } else if (action === "back_features") {
      setView("features");
      setDetailId(null);
    } else if (action.startsWith("feature:")) {
      const id = action.replace("feature:", "");
      const f = getFeatureById(id);
      if (f) {
        setDetailId(id);
        setView("detail");
        addBotMsg(`*${f.name}*\n${f.desc}\n\n✅ *Cara bener:* ${f.correct}\n❌ *Yang salah:* ${f.wrong}`);
      }
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setMsgs((p) => [...p, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: msgs }),
      });
      const d = await res.json();
      setMsgs((p) => [...p, { role: "assistant", content: d.reply || "Error, coba lagi ya" }]);
    } catch {
      setMsgs((p) => [...p, { role: "assistant", content: "Wah error bro, coba lagi nanti!" }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const featureBtns = chunkFeatures(features.map(featureBtn), 2);

  let keyboard: Btn[][] | null = null;
  if (view === "menu") keyboard = MENU_BTNS;
  else if (view === "features") keyboard = [...featureBtns, [{ label: "🔙 Kembali", action: "back_menu" }]];
  else if (view === "detail") keyboard = [[{ label: "🔙 Kembali ke Fitur", action: "back_features" }]];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[999] w-14 h-14 bg-pink-500 text-white rounded-full comic-border shadow-[4px_4px_0_#000] flex items-center justify-center hover:scale-110 transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[999] flex sm:items-end sm:justify-end sm:p-4 bg-black/30">
          <div
            className="w-full h-full sm:w-[400px] sm:h-[580px] bg-white comic-border shadow-[6px_6px_0_#000] flex flex-col sm:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-display uppercase text-sm tracking-wider leading-none block">ZA-BOT</span>
                  <span className="text-[9px] text-green-300 font-body">online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-70 p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center border-2 border-black shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 border-2 border-black text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-yellow-300 text-black rounded-[14px_4px_14px_14px]"
                        : "bg-white text-black rounded-[4px_14px_14px_14px]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center border-2 border-black shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border-2 border-black px-4 py-3 rounded-[4px_14px_14px_14px]">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {keyboard && !loading && (
              <div className="border-t-4 border-black bg-gray-50 px-2.5 py-2 shrink-0">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {keyboard.map((row, ri) => (
                    <div key={ri} className="flex gap-1.5 w-full">
                      {row.map((btn, bi) => (
                        <button
                          key={bi}
                          onClick={() => processAction(btn.action)}
                          className={`flex-1 text-[11px] border-2 border-black px-2.5 py-2 font-body font-bold uppercase tracking-tight transition-all ${
                            btn.action.startsWith("feature:")
                              ? "bg-yellow-200 hover:bg-yellow-300 active:translate-x-[1px] active:translate-y-[1px]"
                              : btn.action === "back_menu" || btn.action === "back_features"
                              ? "bg-gray-200 hover:bg-gray-300 text-[10px] active:translate-x-[1px] active:translate-y-[1px]"
                              : "bg-pink-500 text-white hover:bg-pink-600 active:translate-x-[1px] active:translate-y-[1px]"
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === "chat" && (
              <form onSubmit={handleSubmit} className="border-t-4 border-black p-2.5 flex gap-2 bg-white shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 border-2 border-black px-3 py-2.5 text-sm font-body outline-none bg-gray-50 rounded-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="comic-btn !px-3 !py-2.5 bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            {view !== "chat" && (
              <div className="border-t-4 border-black bg-gray-50 shrink-0">
                <button
                  onClick={() => { setView("chat"); addBotMsg("Oke, mode ngobrol! Tulis aja apa yang mau lo tanyain 👍"); }}
                  className="w-full py-2.5 px-3 flex items-center gap-2 justify-center hover:bg-yellow-100 transition-colors font-body text-xs font-bold text-gray-500"
                >
                  <Send className="w-3.5 h-3.5" />
                  Atau ketik manual...
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
