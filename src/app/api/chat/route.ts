import { NextRequest, NextResponse } from "next/server";
import { findLocalResponse } from "@/lib/chat-knowledge";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Pesan diperlukan" }, { status: 400 });

    const local = findLocalResponse(message);
    if (local) return NextResponse.json({ reply: local, source: "local" });

    return NextResponse.json({
      reply: "Maaf bro, gua belum paham soal itu. Coba tanya tentang fitur yang ada atau cara pakenya ya! 🤖\n\nKetik 'fitur' buat liat daftar tools.",
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ reply: "Error internal bro, coba lagi nanti!" }, { status: 500 });
  }
}
