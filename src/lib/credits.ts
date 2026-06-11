const STORAGE_KEY = "stbz_credits";
const MAX_FREE = 3;

export type ToolId = "tiktok" | "removebg" | "pdftoword" | "ocr" | "pictopdf" | "dorking" | "jurnal" | "json" | "quote" | "barber" | "linktree" | "markdown" | "photobox";

export function getUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    return data[toolId] || 0;
  } catch { return 0; }
}

export function incrementUsage(toolId: ToolId): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    data[toolId] = (data[toolId] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data[toolId];
  } catch { return 0; }
}

export function getRemaining(toolId: ToolId): number {
  return Math.max(0, MAX_FREE - getUsage(toolId));
}

export function isLimitReached(toolId: ToolId): boolean {
  return getUsage(toolId) >= MAX_FREE;
}
