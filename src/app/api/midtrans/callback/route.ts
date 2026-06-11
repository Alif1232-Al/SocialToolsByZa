import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, signature_key } = body;

    const auth = Buffer.from(SERVER_KEY + ":").toString("base64");
    const verifyRes = await fetch(
      `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const verifyData = await verifyRes.json();

    const isValid = verifyData.transaction_status === transaction_status;
    if (!isValid) {
      return NextResponse.json({ error: "Invalid notification" }, { status: 401 });
    }

    if (transaction_status === "settlement" || transaction_status === "capture") {
      console.log(`[MIDTRANS] Premium paid: ${order_id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Midtrans callback error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
