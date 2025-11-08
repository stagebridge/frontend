import { useNavigate } from "react-router-dom";
import KoreaMap from "@/assets/maps/korea.svg?react";
import JapanMap from "@/assets/maps/japan.svg?react";

export default function CountryPicker() {
  const navigate = useNavigate();

  const regionMap = { KR: "KOREA", JP: "JAPAN" } as const;
  const onPick = (code: "KR" | "JP") => {
    const region = regionMap[code];
    navigate(`/search?region=${region}&page=1`);
  };

  return (
    <section className="mx-auto mt-2 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-6 text-[25px] font-bold text-slate-800 dark:text-slate-100">
        국가를 선택하세요!
      </h2>

      <div className="relative flex items-center justify-center gap-24 overflow-hidden rounded-2xl border bg-white/50 p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <button
          onClick={() => onPick("KR")}
          className="group relative rounded-xl p-2 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="대한민국 공연 보기"
        >
          <KoreaMap className="h-56 w-auto fill-slate-300 transition group-hover:fill-emerald-400 dark:fill-neutral-600 dark:group-hover:fill-emerald-400" />
          <span className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-emerald-300/60" />
        </button>

        {/* 일본 */}
        <button
          onClick={() => onPick("JP")}
          className="group relative rounded-xl p-2 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="일본 공연 보기"
        >
          <JapanMap className="h-56 w-auto fill-emerald-400/80 transition group-hover:fill-emerald-500 dark:fill-emerald-500/70 dark:group-hover:fill-emerald-400" />
          <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 dark:text-slate-400">
          </span>
        </button>
      </div>
    </section>
  );
}
