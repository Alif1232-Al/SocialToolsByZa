import { Megaphone } from "lucide-react";

export default function AdWidget() {
  return (
    <div className="comic-panel bg-gradient-to-br from-yellow-200 via-pink-100 to-cyan-100 border-4 border-black min-h-[120px] flex items-center justify-center">
      <div className="text-center px-4 py-6">
        <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="font-body font-bold text-[10px] uppercase text-gray-500 tracking-wider">Iklan</p>
        <p className="font-body text-[10px] text-gray-400 mt-0.5">Hubungi admin untuk pasang iklan</p>
      </div>
    </div>
  );
}
