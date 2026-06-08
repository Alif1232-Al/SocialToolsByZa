"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

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
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [photoData, setPhotoData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = params.get("c");
    const raw = params.get("d");

    if (code) {
      fetch(`/api/link/${code}`)
        .then((r) => r.json())
        .then((data) => {
          setName(data.name || "");
          setBio(data.bio || "");
          setLinks(data.links || []);
          setPhotoData(data.photo || "");
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (raw) {
      try {
        const data = JSON.parse(atob(raw));
        setName(data.name || "");
        setBio(data.bio || "");
        setLinks(data.links || []);
        setPhotoData(data.photo || "");
      } catch {}
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [params]);

  const displayName = name || "Bio Links";
  const initial = displayName[0].toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-cyan-300 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-300 via-pink-300 to-cyan-300 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-400 border-4 border-black rotate-12 opacity-30" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-yellow-400 border-4 border-black -rotate-6 opacity-30" />

      <div className="relative w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {photoData ? (
              <img src={photoData} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-black shadow-[4px_4px_0_#000]" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-black border-4 border-black shadow-[4px_4px_0_#000]">
                {initial}
              </div>
            )}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-cyan-400 border-2 border-black rounded-full flex items-center justify-center text-xs font-bold">✦</div>
          </div>
          <h1 className="mt-4 text-3xl font-black uppercase italic text-black drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)]">{displayName}</h1>
          {bio && <p className="text-sm text-gray-700 mt-2 max-w-xs text-center">{bio}</p>}
          <p className="text-xs font-bold text-gray-700 mt-2 uppercase tracking-widest">{links.length} LINKS</p>
        </div>

        <div className="space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-full text-white font-bold text-sm border-3 border-black shadow-[3px_3px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              style={{ backgroundColor: getColor(link.label), borderWidth: 3, borderStyle: "solid", borderColor: "#000" }}
            >
              <span className="text-lg">{getIcon(link.label)}</span>
              <span className="flex-1">{link.label}</span>
              <span className="text-xs opacity-60 truncate max-w-[100px]">
                {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </a>
          ))}
        </div>

        <p className="text-center text-[10px] font-bold text-black opacity-40 mt-8 uppercase tracking-widest">
          socialtoolsbyza
        </p>
      </div>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-yellow-200">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LinkContent />
    </Suspense>
  );
}
