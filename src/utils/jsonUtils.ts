export function formatJson(input: string): { result: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { result: "", error: (e as Error).message };
  }
}

export function validateJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
