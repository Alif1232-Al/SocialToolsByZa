import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, nama, dan password diperlukan" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const user = await createUser(email, name, password, "user");
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal daftar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
