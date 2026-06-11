import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const TRIPAY_API = "https://tripay.co.id/api/transaction/create";
const MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || "";
const API_KEY = process.env.TRIPAY_API_KEY || "";
const PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Nama diperlukan" }, { status: 400 });
    }

    if (!MERCHANT_CODE || !API_KEY || !PRIVATE_KEY) {
      return NextResponse.json({ error: "Tripay belum dikonfigurasi" }, { status: 500 });
    }

    const merchantRef = `STBZ-${Date.now()}`;
    const amount = 15000;

    const signature = crypto
      .createHash("sha256")
      .update(MERCHANT_CODE + merchantRef + amount + PRIVATE_KEY)
      .digest("hex");

    const body = {
      method: "QRIS",
      merchant_ref: merchantRef,
      amount,
      customer_name: name,
      customer_email: "-",
      order_items: [{ sku: "PREMIUM-1M", name: "Premium 1 Bulan", price: amount, quantity: 1 }],
      callback_url: `https://${req.headers.get("host") || "social-tools-by-za.vercel.app"}/api/tripay/callback`,
      return_url: `https://${req.headers.get("host") || "social-tools-by-za.vercel.app"}/payment/success?ref=${merchantRef}`,
      signature,
    };

    const res = await fetch(TRIPAY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ error: data.message || "Gagal membuat transaksi" }, { status: 502 });
    }

    return NextResponse.json({
      reference: merchantRef,
      checkoutUrl: data.data.checkout_url,
      qrUrl: data.data.qr_url || null,
    });
  } catch (err) {
    console.error("Tripay create error:", err);
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}
