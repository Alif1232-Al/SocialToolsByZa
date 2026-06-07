import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
};

// ── JSON fallback helpers ──

function readJsonUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch { return []; }
}

function writeJsonUsers(users: StoredUser[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// ── Public API ──

export async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from("users").select("*").eq("email", email).maybeSingle();
    if (error) console.error("getUserByEmail error:", error);
    if (data) return mapRow(data);
    return undefined;
  }
  return readJsonUsers().find((u) => u.email === email);
}

export async function getAllUsers(): Promise<Omit<StoredUser, "password">[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data } = await sb.from("users").select("*").order("created_at", { ascending: false });
    return (data || []).map((r: any) => {
      const { password_hash, ...rest } = r;
      return { id: rest.id, email: rest.email, name: rest.name, role: rest.role, createdAt: rest.created_at };
    });
  }
  return readJsonUsers().map(({ password, ...u }) => u);
}

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: "admin" | "user" = "user"
): Promise<StoredUser> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { data: existing } = await sb.from("users").select("id").eq("email", email).maybeSingle();
    if (existing) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();

    const { error } = await sb.from("users").insert({
      id,
      email,
      name,
      password_hash: hashed,
      role,
      created_at: now,
    });
    if (error) throw new Error(error.message);
    return { id, email, name, password: hashed, role, createdAt: now };
  }

  const users = readJsonUsers();
  if (users.find((u) => u.email === email)) throw new Error("Email already exists");
  const hashed = await bcrypt.hash(password, 10);
  const user: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email, name, password: hashed, role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJsonUsers(users);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  if (id === "admin") throw new Error("Tidak bisa menghapus akun admin utama");

  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin()!;
    const { error } = await sb.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const users = readJsonUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User tidak ditemukan");
  users.splice(idx, 1);
  writeJsonUsers(users);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;

  // seed JSON fallback
  const users = readJsonUsers();
  if (!users.some((u) => u.email === adminEmail)) {
    users.push({
      id: "admin",
      email: adminEmail,
      name: "Admin Za",
      password: bcrypt.hashSync(adminPassword, 10),
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    writeJsonUsers(users);
  }
}

function mapRow(r: any): StoredUser {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    password: r.password_hash,
    role: r.role,
    createdAt: r.created_at,
  };
}
