import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, verifyPassword, seedAdmin } from "@/lib/userStore";
import { createSession, setSessionCookie } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

seedAdmin();

export async function POST(req: NextRequest) {
  try {
    // Sync admin dari .env.local ke Supabase
    if (isSupabaseConfigured()) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const sb = getSupabaseAdmin()!;
        const hashed = bcrypt.hashSync(adminPassword, 10);
        const { data: existing } = await sb.from("users").select("id").eq("id", "admin").maybeSingle();
        if (existing) {
          await sb.from("users").update({ email: adminEmail, password_hash: hashed }).eq("id", "admin");
        } else {
          await sb.from("users").insert({
            id: "admin",
            email: adminEmail,
            name: "Admin Za",
            password_hash: hashed,
            role: "admin",
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    if (user.password === "") {
      return NextResponse.json({ error: "Akun bermasalah — password kosong" }, { status: 500 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal login";
    console.error("Login error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
