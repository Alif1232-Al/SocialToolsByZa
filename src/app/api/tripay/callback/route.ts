import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { merchant_ref, status, signature } = body;

    const calcSig = crypto
      .createHash("sha256")
      .update(PRIVATE_KEY + merchant_ref + status)
      .digest("hex");

    if (signature !== calcSig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (status === "PAID") {
      console.log(`[TRIPAY] Premium paid: ${merchant_ref}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tripay callback error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
