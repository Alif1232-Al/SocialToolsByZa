import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nama diperlukan" }, { status: 400 });
    }

    if (!SERVER_KEY) {
      return NextResponse.json({ error: "Midtrans belum dikonfigurasi" }, { status: 500 });
    }

    const orderId = `STBZ-${Date.now()}`;
    const auth = Buffer.from(SERVER_KEY + ":").toString("base64");

    const body = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 15000,
      },
      customer_details: {
        first_name: name,
      },
      item_details: [
        {
          id: "PREMIUM-1M",
          price: 15000,
          quantity: 1,
          name: "Premium 1 Bulan - SocialToolsByZa",
        },
      ],
      callbacks: {
        finish: `https://${req.headers.get("host") || "social-tools-by-za.vercel.app"}/payment/success?order_id=${orderId}`,
      },
    };

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error_messages) {
      return NextResponse.json({ error: data.error_messages.join(", ") }, { status: 502 });
    }

    return NextResponse.json({
      orderId,
      redirectUrl: data.redirect_url,
      token: data.token,
    });
  } catch (err) {
    console.error("Midtrans create error:", err);
    return NextResponse.json({ error: "Gagal memproses pembayaran" }, { status: 500 });
  }
}
