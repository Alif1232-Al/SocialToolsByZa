import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createUser, getAllUsers, deleteUser } from "@/lib/userStore";

export async function GET() {
  const session = await verifySession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, password } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, dan password diperlukan" }, { status: 400 });
    }

    const user = await createUser(email, name, password, "user");
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membuat akun";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID user diperlukan" }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus user";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
