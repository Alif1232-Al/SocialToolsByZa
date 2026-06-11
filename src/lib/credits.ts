const CREDITS_KEY = "stbz_credits";
const PREMIUM_KEY = "stbz_premium";
const MAX_FREE_DEFAULT = 3;

const MAX_FREE: Partial<Record<ToolId, number>> = {
  json: 999,
  quote: 999,
};

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
}

export function getUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    return data[toolId] || 0;
  } catch { return 0; }
}

export function incrementUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    data[toolId] = (data[toolId] || 0) + 1;
    localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
    return data[toolId];
  } catch { return 0; }
}

function getMaxFree(toolId: ToolId): number {
  if (isPremium()) return Infinity;
  const base = MAX_FREE[toolId] ?? MAX_FREE_DEFAULT;
  if (isLoggedIn() && base < 999) return Math.max(base, 5);
  return base;
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
