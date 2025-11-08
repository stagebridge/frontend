export default function SearchInput() {
  return (
    <div className="relative w-full max-w-xl">
      {/* 아이콘 */}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </div>
      <input
        type="search"
        placeholder="한국과 일본의 콘서트를 검색하세요"
        className="w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 py-2 text-[14px]
                   outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-slate-300
                   dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-100"
      />
    </div>
  );
}
