import { NextRequest, NextResponse } from "next/server";
import { findLocalResponse, SYSTEM_PROMPT } from "@/lib/chat-knowledge";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: "Pesan diperlukan" }, { status: 400 });

    const local = findLocalResponse(message);
    if (local) return NextResponse.json({ reply: local, source: "local" });

    if (!API_KEY) return NextResponse.json({ reply: "Maaf bro, AI lagi mati suri. Coba tanya lagi nanti ya! 🤖💤", source: "fallback" });

    const contents = [
      ...(history || [])
        .slice(-10)
        .map((m: { role: string; content: string }) => ({
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
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.9, maxOutputTokens: 600 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ reply: "Wah, AI-nya lagi error. Coba lagi nanti ya! 😅", source: "error" });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maap bro, gaga nangkep. Coba ulang lagi ya!";
    return NextResponse.json({ reply, source: "ai" });
  } catch {
    return NextResponse.json({ reply: "Error internal bro, coba lagi nanti!" }, { status: 500 });
  }
}
