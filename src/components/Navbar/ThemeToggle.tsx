import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // ✅ 초기값: 로컬스토리지 또는 현재 DOM 상태
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("sb_theme") as "light" | "dark" | null;
    if (saved) return saved;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  // ✅ 테마 변경 시 DOM과 로컬스토리지 반영
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("sb_theme", theme);
  }, [theme]);

  // ✅ 버튼 렌더링
  return (
    <button
      type="button"
      aria-label="테마 전환"
      title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
      className="rounded-full p-2 text-lg transition hover:bg-black/5 dark:hover:bg-white/10"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
