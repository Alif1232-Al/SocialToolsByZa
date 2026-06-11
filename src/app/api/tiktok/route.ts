import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL TikTok diperlukan" }, { status: 400 });
    }

    const res = await fetch("https://tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, hd: "1" }),
    });

    const data = await res.json();
    if (!data.data?.play) {
      return NextResponse.json({ error: "Gagal mengambil video dari TikTok" }, { status: 502 });
    }

    return NextResponse.json({
      videoUrl: data.data.play,
      title: data.data.title || "",
      author: data.data.author?.nickname || "",
    });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
