// src/hooks/useFavorites.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
} from "../app/storage/mypageStorage";

/**
 * 찜(즐겨찾기) 관리 훅
 * - 저장 위치: localStorage "sb_mypage_settings" (MySettings.favorites: string[])
 * - 제공:
 *   - favorites: string[]
 *   - isFavorite(id)
 *   - addFavorite(id)
 *   - removeFavorite(id)
 *   - toggleFavorite(id)
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const settings = loadSettings() ?? defaultSettings();
    return Array.isArray(settings.favorites) ? settings.favorites : [];
  });

  const persist = useCallback((next: string[]) => {
    if (typeof window === "undefined") return;

    const settings = loadSettings() ?? defaultSettings();
    const unique = Array.from(new Set(next));

    saveSettings({ ...settings, favorites: unique });
    setFavorites(unique);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const addFavorite = useCallback(
    (id: string) => {
      if (!id) return;
      persist([...favorites, id]);
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (!id) return;
      persist(favorites.filter((x) => x !== id));
    },
    [favorites, persist],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (!id) return;

      if (favorites.includes(id)) {
        persist(favorites.filter((x) => x !== id));
      } else {
        persist([...favorites, id]);
      }
    },
    [favorites, persist],
  );

  // 다른 탭 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "sb_mypage_settings") return;

      const settings = loadSettings() ?? defaultSettings();
      const next = Array.isArray(settings.favorites) ? settings.favorites : [];
      setFavorites(Array.from(new Set(next)));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite],
  );
}

/**
 * ✅ V1 코드 호환을 위한 default export
 * - Favorites.tsx / Search.tsx가 `import useFavorites from ...` 형태를 사용 중이므로 유지합니다.
 */
export default useFavorites;
