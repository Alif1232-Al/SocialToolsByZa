import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();
    if (!videoUrl) {
      return NextResponse.json({ error: "URL video diperlukan" }, { status: 400 });
    }

    const res = await fetch(videoUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "Gagal mengambil video" }, { status: 502 });
    }

    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="tiktok-video.mp4"',
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Gagal memproses unduhan" }, { status: 500 });
  }
}
