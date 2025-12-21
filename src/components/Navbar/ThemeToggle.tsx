import { useEffect, useMemo, useRef, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "sb_theme";
const EVENT_NAME = "sb-theme-change";

function readThemeFromDomOrStorage(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  localStorage.setItem(STORAGE_KEY, theme);

  // ✅ 동일 앱 내 다른 ThemeToggle 인스턴스 동기화용
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: theme }));
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readThemeFromDomOrStorage());

  // 중복 적용/무한 루프 방지용
  const lastAppliedRef = useRef<Theme | null>(null);

  const nextTitle = useMemo(
    () => (theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"),
    [theme],
  );

  // ✅ 이 인스턴스에서 theme 변경 시 DOM + storage 반영
  useEffect(() => {
    if (lastAppliedRef.current === theme) return;
    lastAppliedRef.current = theme;
    applyTheme(theme);
  }, [theme]);

  // ✅ 외부(다른 토글/다른 탭/DOM 변경)에서 theme 변경 시 이 컴포넌트 state도 동기화
  useEffect(() => {
    const syncFromDom = () => {
      const domTheme: Theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      setTheme((prev) => (prev === domTheme ? prev : domTheme));
    };

    // 1) 같은 페이지 내 다른 ThemeToggle이 dispatch한 이벤트
    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<Theme>;
      const next = ce.detail;
      if (next === "light" || next === "dark") {
        setTheme((prev) => (prev === next ? prev : next));
      } else {
        syncFromDom();
      }
    };

    // 2) 다른 탭에서 localStorage 변경
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue as Theme | null;
      if (next === "light" || next === "dark") {
        setTheme((prev) => (prev === next ? prev : next));
      } else {
        syncFromDom();
      }
    };

    // 3) DOM class 변경(직접 class 조작하는 코드가 있어도 대응)
    const observer = new MutationObserver(() => syncFromDom());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener(EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);

    // 최초 동기화
    syncFromDom();

    return () => {
      observer.disconnect();
      window.removeEventListener(EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="테마 전환"
      title={nextTitle}
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="rounded-full p-2 text-lg transition hover:bg-black/5 dark:hover:bg-white/10"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
