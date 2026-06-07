"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Loader2, Trash2, AlertTriangle, Shield, LogOut } from "lucide-react";

type User = { id: string; email: string; name: string; role: string; createdAt: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/register");
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) throw new Error("Gagal fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setShowForm(false);
      setEmail("");
      setName("");
      setPassword("");
      await fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || "Gagal");
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin mau hapus user "${name}"?`)) return;
    try {
      const res = await fetch("/api/auth/register", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Gagal");
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Gagal hapus");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="comic-panel bg-gray-900 text-white">
          <div className="comic-badge -top-4 -right-4 rotate-12 bg-yellow-400 text-black">ADMIN!</div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 className="font-display text-headline-md uppercase italic flex items-center gap-2">
              <Shield className="w-6 h-6" />Admin Panel
            </h1>
            <button onClick={handleLogout}
              className="bg-red-500 text-white border-2 border-black px-4 py-2 font-body font-bold text-xs uppercase hover:bg-red-600 transition-colors flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="font-body font-bold text-xs uppercase text-white/60">
              Total Users: {users.length}
            </span>
            <button onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white border-2 border-black px-3 py-1.5 font-body font-bold text-xs uppercase hover:bg-green-700 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> {showForm ? "Close" : "Add User"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="bg-white border-4 border-black p-4 mb-4 space-y-3">
              <h4 className="font-body font-bold text-sm uppercase text-gray-800">Buat Akun Baru</h4>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" required
                className="w-full border-2 border-black p-2 font-body font-bold text-sm outline-none text-black" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Nama" required
                className="w-full border-2 border-black p-2 font-body font-bold text-sm outline-none text-black" />
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" required
                className="w-full border-2 border-black p-2 font-body font-bold text-sm outline-none text-black" />
              {createError && (
                <div className="bg-red-100 border border-red-500 text-red-700 p-2 font-body font-bold text-xs">{createError}</div>
              )}
              <button type="submit" disabled={creating}
                className="w-full bg-cyan-500 text-white border-2 border-black py-2 font-body font-bold text-xs uppercase hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create User</>}
              </button>
            </form>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-body font-bold text-xs flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}

          <div className="space-y-1 max-h-[500px] overflow-y-auto bg-white border-4 border-black divide-y divide-gray-200">
            {users.length === 0 ? (
              <p className="p-4 font-body text-sm text-gray-400 italic text-center">Belum ada user</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-full ${u.role === "admin" ? "bg-yellow-400" : "bg-cyan-500"} flex items-center justify-center text-black font-display font-black text-sm`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body font-bold text-sm text-gray-900 truncate">{u.name}</p>
                      <p className="font-body text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 font-body font-bold text-[10px] uppercase border border-black ${u.role === "admin" ? "bg-yellow-200 text-black" : "bg-gray-100 text-gray-600"}`}>
                      {u.role}
                    </span>
                    {u.role !== "admin" && (
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors" title="Hapus user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
