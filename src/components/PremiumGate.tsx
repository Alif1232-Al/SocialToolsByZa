"use client";
import { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";

type PremiumGateProps = {
  children: ReactNode;
  title?: string;
};

const B3 = { borderWidth: 3, borderStyle: "solid" as const };
const SH = { boxShadow: "3px 3px 0 rgba(0,0,0,1)" };

function Locked({ title }: { title?: string }) {
  return (
    <div className="relative comic-panel bg-white overflow-hidden">
      <div className="comic-badge -top-3 -right-3 rotate-12 bg-pink-500 text-white border-white text-[10px] px-2 py-1">PREMIUM!</div>
      <div className="flex flex-col items-center justify-center text-center py-6 px-2">
        <div className="w-14 h-14 rounded-2xl bg-pink-500 flex items-center justify-center mb-3 -rotate-3" style={{ ...B3, borderColor: "#000", ...SH }}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>

        <p className="font-display text-xl uppercase italic mb-1 text-gray-900">{title || "EXCLUSIVE"}</p>
        <p className="font-body text-xs text-gray-500 max-w-[220px] mb-3">Chat buat dapetin akun!</p>

        <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
          <a href="https://www.instagram.com/popify_dev/" target="_blank" rel="noopener noreferrer"
            className="bg-pink-500 text-white px-3 py-2 font-body font-bold uppercase text-[10px] flex items-center justify-center gap-1.5" style={{ ...B3, borderColor: "#000", ...SH }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            IG @popify_dev
          </a>
          <a href="https://wa.me/6285177824235?text=Halo%20Za!%20Saya%20mau%20minta%20akun%20SocialTools" target="_blank" rel="noopener noreferrer"
            className="bg-green-500 text-white px-3 py-2 font-body font-bold uppercase text-[10px] flex items-center justify-center gap-1.5" style={{ ...B3, borderColor: "#000", ...SH }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.598 1.521 5.557 1.522 5.513 0 10-4.487 10-10.001 0-2.669-1.04-5.181-2.929-7.071-1.891-1.889-4.403-2.929-7.071-2.929-5.513 0-10 4.486-10.001 10 0 1.905.543 3.764 1.581 5.369l-.927 3.385 3.789-.976z"/><path d="M10.425 12.593c-.169-.978-.424-1.464-.89-2.035-.648-.793-1.619-1.291-2.479-.898-.871.399-1.341 1.594-1.181 2.567.11.668.814 1.354 1.381 1.713l.769.578c.988.742 2.104 1.331 3.375 1.633 1.24.295 2.566.217 3.776-.208.684-.241 1.191-.662 1.417-1.256.383-1.005-.04-2.013-.817-2.371l-1.479-.682c-.927-.428-1.522-.021-2.057.597-.213.247-.409.507-.648.676-.644.457-1.812.571-2.476-.183-.466-.53-.576-1.244-.701-1.956l-.011-.075c-.051-.345-.146-.628-.24-.913-.066-.201-.136-.395-.17-.614z"/></svg>
            WA Admin
          </a>
        </div>

        <p className="mt-3 font-body text-[10px] text-gray-400">
          Udah punya akun? <a href="/login" className="text-cyan-600 font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}

export default function PremiumGate({ children, title }: PremiumGateProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="relative comic-panel bg-gray-100 flex items-center justify-center min-h-[160px]">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <div className="h-full flex flex-col">{children}</div>;
  }

  return <Locked title={title} />;
}
