"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { QUICK_PROMPTS } from "@/lib/chat-knowledge";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = "Halo! Aku ZA-BOT 🤖 siap bantu tugas kuliah, ngoding, atau sekedar ngobrol santai. Ada yang bisa dibantu?";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-zabot", handler);
    return () => window.removeEventListener("open-zabot", handler);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowPrompts(false);
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

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[999] w-14 h-14 bg-pink-500 text-white rounded-full comic-border shadow-[4px_4px_0_#000] flex items-center justify-center hover:scale-110 transition-transform active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          aria-label="Chat dengan ZA-BOT"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[999] flex sm:items-end sm:justify-end sm:p-4 bg-black/30">
          <div
            className="w-full h-full sm:w-96 sm:h-[520px] bg-white comic-border shadow-[6px_6px_0_#000] flex flex-col sm:rounded-2xl overflow-hidden animate-[slideUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="font-display uppercase text-sm tracking-wider">ZA-BOT</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-70 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] px-3 py-2 border-2 border-black text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-yellow-300 text-black rounded-tl-xl rounded-br-xl rounded-bl-xl"
                        : "bg-gray-100 text-black rounded-tr-xl rounded-bl-xl rounded-br-xl"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}

              {showPrompts && msgs.length === 1 && (
                <div className="pt-1 space-y-1.5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">Coba tanya:</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {QUICK_PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(p.text)}
                        className="text-[11px] border-2 border-black px-2.5 py-1 rounded-full bg-white hover:bg-yellow-200 transition-colors font-body font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border-2 border-black px-3 py-2 rounded-tr-xl rounded-bl-xl rounded-br-xl">
                    <span className="animate-bounce inline-block">...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t-4 border-black p-2.5 flex gap-2 bg-gray-50 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 border-2 border-black px-3 py-2 text-sm font-body outline-none bg-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="comic-btn !px-3 !py-2 bg-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
