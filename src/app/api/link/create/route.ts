import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const storeMap = globalThis as unknown as { __linkStore?: Map<string, unknown> };
if (!storeMap.__linkStore) storeMap.__linkStore = new Map();

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const store = storeMap.__linkStore!;
    let code = Math.random().toString(36).substring(2, 8);
    while (store.has(code)) code = Math.random().toString(36).substring(2, 8);
    store.set(code, data);
    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method tidak diizinkan" }, { status: 405 });
}
