import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Login dulu bro" }, { status: 401 });
    }

    const { email } = await req.json();
    const targetEmail = email || session.email;

    if (isSupabaseConfigured()) {
      const sb = getSupabaseAdmin()!;
      const { error } = await sb.from("users").update({ role: "premium" }).eq("email", targetEmail);
      if (error) throw new Error(error.message);
    } else {
      const users: any[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "[]");
      const idx = users.findIndex((u) => u.email === targetEmail);
      if (idx === -1) throw new Error("User gak ditemukan");
      users[idx].role = "premium";
      try { fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2)); } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal upgrade";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
