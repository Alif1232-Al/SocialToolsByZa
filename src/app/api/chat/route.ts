import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const SYSTEM = `Kamu adalah ZA-BOT, asisten AI gaul khas anak Indonesia yang bantu tugas kuliah, ngoding, dan ngonten.
Jawab pake bahasa Indonesia santai, gaul, tapi tetep informatif dan jelas. Bisa bahasa prokem dikit.
Jangan toxic, jangan nyuruh hal berbahaya. Kalo ditanya di luar kemampuan, bilang jujur "Gak nyangka lo nanya gitu, tapi gua ga bisa jawab, maaf bro".
Pendek aja jawabnya, ga usah panjang-panjang, kecuali diminta detail.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: "Pesan diperlukan" }, { status: 400 });
    if (!API_KEY) return NextResponse.json({ error: "API key belum diset" }, { status: 500 });

    const contents = [
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM }] },
        generationConfig: { temperature: 0.9, maxOutputTokens: 600 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "Gagal komunikasi dengan AI" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maap bro, gaga nangkep. Coba ulang lagi ya!";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
