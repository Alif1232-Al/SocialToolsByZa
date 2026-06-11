import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.TRIPAY_API_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("ref");
    if (!reference) {
      return NextResponse.json({ error: "Reference diperlukan" }, { status: 400 });
    }

    const res = await fetch(`https://tripay.co.id/api/transaction/detail?reference=${reference}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ error: data.message || "Gagal cek transaksi" }, { status: 502 });
    }

    return NextResponse.json({
      status: data.data.status,
      paidAt: data.data.paid_at || null,
    });
  } catch (err) {
    console.error("Tripay check error:", err);
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}
