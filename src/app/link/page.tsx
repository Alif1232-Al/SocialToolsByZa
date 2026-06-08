"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F", tiktok: "#000000", youtube: "#FF0000",
  twitter: "#000000", linkedin: "#0A66C2", whatsapp: "#25D366",
  telegram: "#0088CC", github: "#333333", website: "#6366F1",
  shopee: "#EE4D2D", facebook: "#1877F2", threads: "#000000",
  snapchat: "#FFFC00", discord: "#5865F2", spotify: "#1DB954",
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", tiktok: "🎵", youtube: "▶️",
  twitter: "🐦", linkedin: "💼", whatsapp: "💬",
  telegram: "✈️", github: "💻", website: "🌐",
  shopee: "🛒", facebook: "👍", threads: "🧵",
  snapchat: "👻", discord: "🎮", spotify: "🎧",
};

function getColor(label: string) {
  for (const [k, v] of Object.entries(PLATFORM_COLORS))
    if (label.toLowerCase().includes(k)) return v;
  return "#333";
}

function getIcon(label: string) {
  for (const [k, v] of Object.entries(PLATFORM_ICONS))
    if (label.toLowerCase().includes(k)) return v;
  return "🔗";
}

function LinkContent() {
  const params = useSearchParams();
  const raw = params.get("d");
  let name = "";
  let links: { label: string; url: string }[] = [];

  try {
    if (raw) {
      const data = JSON.parse(atob(raw));
      name = data.name || "";
      links = data.links || [];
    }
  } catch {}

  const displayName = name || "Bio Links";
  const initial = displayName[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white mb-4">
            {initial}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          <p className="text-sm text-gray-500 mt-1">{links.length} links</p>
        </div>

        <div className="space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full text-white font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
              style={{ backgroundColor: getColor(link.label) }}
            >
              <span className="text-lg">{getIcon(link.label)}</span>
              <span className="flex-1">{link.label}</span>
              <span className="text-xs opacity-60 truncate max-w-[100px]">
                {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </a>
          ))}
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8">
          socialtoolsbyza
        </p>
      </div>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LinkContent />
    </Suspense>
  );
}
