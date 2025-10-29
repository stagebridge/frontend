// src/app/components/Home/CountryPicker.tsx
import { useNavigate } from "react-router-dom";

export default function CountryPicker() {
  const navigate = useNavigate();

  const onPick = (code: "KR" | "JP") => {
    // 상세 검색은 나중에 연결. 일단 쿼리로만 이동
    navigate(`/list?country=${code}`);
  };

  return (
    <section className="mx-auto mt-2 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-6 text-[25px] font-bold text-slate-800 dark:text-slate-100">
        국가를 선택하세요!
      </h2>

      <div className="relative flex items-center justify-center gap-16 overflow-hidden rounded-2xl border bg-white/50 p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        {/* 한국 */}
        <button
          onClick={() => onPick("KR")}
          className="group relative rounded-xl p-2 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="대한민국 공연 보기"
        >
          {/* placeholder SVG: 이후 실제 지도 SVG로 교체 */}
          <svg viewBox="0 0 150 200" className="h-56 w-auto">
            <path
              d="M75 10C60 20 50 40 55 55c5 15-5 25-10 35s0 30 15 40 25 10 35 0 10-25 0-40-10-30-5-45 0-25-15-35z"
              className="fill-slate-300 transition group-hover:fill-emerald-400 dark:fill-neutral-600 dark:group-hover:fill-emerald-400"
            />
            <circle cx="30" cy="180" r="6" className="fill-slate-300 dark:fill-neutral-600 transition group-hover:fill-emerald-400" />
          </svg>
          <span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-emerald-300/60" />
        </button>

        {/* 일본 */}
        <button
          onClick={() => onPick("JP")}
          className="group relative rounded-xl p-2 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="일본 공연 보기"
        >
          <svg viewBox="0 0 350 200" className="h-56 w-auto">
            <path
              d="M280 10c-18 6-32 22-36 34-6 18-20 26-35 36s-35 23-40 34 6 20 26 22 36-6 50-16 20-18 34-16 30-4 38-22-3-46-37-72z"
              className="fill-emerald-400/80 transition group-hover:fill-emerald-500 dark:fill-emerald-500/70 dark:group-hover:fill-emerald-400"
            />
            <circle cx="330" cy="180" r="6" className="fill-emerald-400/80 transition group-hover:fill-emerald-500 dark:fill-emerald-500/70" />
          </svg>
          <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 dark:text-slate-400">
            (샘플 SVG, 추후 실제 지도로 교체)
          </span>
        </button>
      </div>
    </section>
  );
}
