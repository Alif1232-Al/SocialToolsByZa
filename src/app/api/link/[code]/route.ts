import { NextRequest, NextResponse } from "next/server";

const storeMap = globalThis as unknown as { __linkStore?: Map<string, unknown> };
if (!storeMap.__linkStore) storeMap.__linkStore = new Map();

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const data = storeMap.__linkStore!.get(params.code);
  if (!data) {
    return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(data);
}
