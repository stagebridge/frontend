// src/components/Navbar/SearchInput.tsx
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 다른 화면으로 이동하면 검색어 초기화
  useEffect(() => {
    // 공연 조회 페이지가 아닐 때는 항상 비움
    if (!location.pathname.startsWith("/search")) {
      setKeyword("");
    }
  }, [location.pathname]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const q = keyword.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl" role="search">
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="한국과 일본의 콘서트를 검색하세요"
        className="w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 py-2 text-[14px]
                   outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-slate-300
                   dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-100"
      />

      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300"
        aria-label="공연 검색"
      >
        🔍
      </button>
    </form>
  );
}
