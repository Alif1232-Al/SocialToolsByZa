import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Kata kunci pencarian diperlukan" }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key belum dikonfigurasi" }, { status: 500 });
    }

    const params = new URLSearchParams({
      engine: "google_scholar",
      q: query,
      api_key: apiKey,
      num: "10",
    });

    const res = await fetch(`https://serpapi.com/search?${params}`);
    const data = await res.json();

    interface SerpResult {
      title?: string;
      link?: string;
      publication_info?: {
        authors?: { name: string }[];
        summary?: string;
      };
      resources?: { link: string }[];
    }

    const results = (data.organic_results || []).map((r: SerpResult) => ({
      title: r.title || "",
      authors: r.publication_info?.authors?.map((a) => a.name).join(", ") || "",
      summary: r.publication_info?.summary || "",
      link: r.link || "",
      pdfLink: r.resources?.[0]?.link || r.link || "",
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Gagal mencari jurnal" }, { status: 500 });
  }
}
