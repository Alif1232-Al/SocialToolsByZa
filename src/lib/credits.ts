const CREDITS_KEY = "stbz_credits_v2";
const PREMIUM_KEY = "stbz_premium";

type CreditEntry = { c: number; d: string };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type ToolId = "tiktok" | "removebg" | "pdftoword" | "ocr" | "pictopdf" | "dorking" | "jurnal" | "json" | "quote" | "barber" | "linktree" | "markdown" | "photobox";

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(PREMIUM_KEY) === "true") return true;
    const authRaw = localStorage.getItem("stbz_auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      if (auth?.role === "premium" || auth?.role === "admin") return true;
    }
    return false;
  } catch { return false; }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem("stbz_auth");
  } catch { return false; }
}

export function activatePremium(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREMIUM_KEY, "true");
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  try { localStorage.setItem("stbz_premium_expiry", expiry.toISOString()); } catch {}
}

export function getPremiumExpiry(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem("stbz_premium_expiry"); } catch { return null; }
}

function readCredits(): Record<string, CreditEntry> {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeCredits(data: Record<string, CreditEntry>) {
  try { localStorage.setItem(CREDITS_KEY, JSON.stringify(data)); } catch {}
}

export function getUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = readCredits();
    const entry = data[toolId];
    if (!entry) return 0;
    if (entry.d !== today()) return 0;
    return entry.c;
  } catch { return 0; }
}

export function incrementUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = readCredits();
    const prev = data[toolId];
    const count = (prev && prev.d === today() ? prev.c : 0) + 1;
    data[toolId] = { c: count, d: today() };
    writeCredits(data);
    return count;
  } catch { return 0; }
}

function getMaxFree(toolId: ToolId): number {
  if (isPremium()) return Infinity;
  if (toolId === "json" || toolId === "quote") return Infinity;
  if (isLoggedIn()) return 5;
  return 2;
}

export function getRemaining(toolId: ToolId): number {
  const limit = getMaxFree(toolId);
  if (!isFinite(limit)) return Infinity;
  return Math.max(0, limit - getUsage(toolId));
}

export function getLimit(toolId: ToolId): number {
  return getMaxFree(toolId);
}

export function isLimitReached(toolId: ToolId): boolean {
  if (isPremium()) return false;
  const limit = getMaxFree(toolId);
  if (!isFinite(limit)) return false;
  return getUsage(toolId) >= limit;
}
