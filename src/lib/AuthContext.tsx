"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = { id: string; email: string; name: string; role: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setUser(d.user); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key]);

  const refresh = () => setKey((k) => k + 1);

  useEffect(() => {
    if (user) {
      try { localStorage.setItem("stbz_auth", JSON.stringify(user)); } catch {}
    }
  }, [user]);

  const logout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
    try { localStorage.removeItem("stbz_auth"); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
