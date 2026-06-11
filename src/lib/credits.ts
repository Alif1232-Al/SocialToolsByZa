const CREDITS_KEY = "stbz_credits";
const PREMIUM_KEY = "stbz_premium";
const MAX_FREE = 3;

export type ToolId = "tiktok" | "removebg" | "pdftoword" | "ocr" | "pictopdf" | "dorking" | "jurnal" | "json" | "quote" | "barber" | "linktree" | "markdown" | "photobox";

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(PREMIUM_KEY) === "true";
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

export function getRemaining(toolId: ToolId): number {
  return Math.max(0, MAX_FREE - getUsage(toolId));
}

export function isLimitReached(toolId: ToolId): boolean {
  if (isPremium()) return false;
  return getUsage(toolId) >= MAX_FREE;
}
