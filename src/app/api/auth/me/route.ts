import { NextResponse } from "next/server";
import { verifySession, clearSession } from "@/lib/auth";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: session.id, email: session.email, name: session.name, role: session.role } });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}
