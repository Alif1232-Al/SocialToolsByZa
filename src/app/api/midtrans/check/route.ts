import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_URL = IS_PRODUCTION
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("order_id");
    if (!orderId) {
      return NextResponse.json({ error: "order_id diperlukan" }, { status: 400 });
    }

    if (!SERVER_KEY) {
      return NextResponse.json({ error: "Midtrans belum dikonfigurasi" }, { status: 500 });
    }

    const auth = Buffer.from(SERVER_KEY + ":").toString("base64");

    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    const data = await res.json();

    return NextResponse.json({
      status: data.transaction_status,
      paidAt: data.settlement_time || data.transaction_time,
    });
  } catch (err) {
    console.error("Midtrans check error:", err);
    return NextResponse.json({ error: "Gagal cek status" }, { status: 500 });
  }
}
