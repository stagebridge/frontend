const FAVORITES_KEY = "sb_favorites";

export function readFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set<string>();

    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set<string>();

    return new Set(arr.filter((v): v is string => typeof v === "string" && v.trim().length > 0));
  } catch {
    return new Set<string>();
  }
}

export function writeFavorites(next: Set<string>): void {
  if (typeof window === "undefined") return;

  const arr = Array.from(next);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}

export function toggleFavorite(id: string): { next: Set<string>; isFavorite: boolean } {
  const current = readFavorites();
  const key = id.trim();

  if (!key) return { next: current, isFavorite: false };

  if (current.has(key)) current.delete(key);
  else current.add(key);

  writeFavorites(current);
  return { next: current, isFavorite: current.has(key) };
}

export function isFavorite(id: string): boolean {
  const current = readFavorites();
  return current.has(id);
}
