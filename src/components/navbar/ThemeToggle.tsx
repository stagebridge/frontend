import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // ✅ 초기값: 현재 DOM 상태 또는 로컬스토리지 기준으로 통일
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = (localStorage.getItem("sb_theme") as "light" | "dark" | null) ?? null;
    if (saved) return saved;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("sb_theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label="테마 전환"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="text-xl"
      title={theme === "light" ? "다크 모드" : "라이트 모드"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
