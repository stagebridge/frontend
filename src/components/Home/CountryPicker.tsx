import { useNavigate } from "react-router-dom";
import KoreaMap from "@/assets/maps/korea.svg?react";
import JapanMap from "@/assets/maps/japan.svg?react";

type Country = "KR" | "JP";

export default function CountryPicker() {
  const navigate = useNavigate();

  const onPick = (country: Country) => {
    const qs = new URLSearchParams();
    qs.set("country", country);
    qs.set("tab", "all");
    qs.set("page", "1");
    navigate(`/search?${qs.toString()}`);
  };

  return (
    <section className="mx-auto mt-2 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-6 text-[25px] font-bold text-slate-800 dark:text-slate-100">
        국가별 공연 보기
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 한국 */}
        <button
          type="button"
          onClick={() => onPick("KR")}
          className="group relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
          aria-label="한국 공연 보기"
        >
          <KoreaMap className="h-56 w-auto fill-sky-400/80 transition group-hover:fill-sky-500 dark:fill-sky-500/70 dark:group-hover:fill-sky-400" />
          <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
            KOREA
          </span>
        </button>

        {/* 일본 */}
        <button
          type="button"
          onClick={() => onPick("JP")}
          className="group relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
          aria-label="일본 공연 보기"
        >
          <JapanMap className="h-56 w-auto fill-emerald-400/80 transition group-hover:fill-emerald-500 dark:fill-emerald-500/70 dark:group-hover:fill-emerald-400" />
          <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
            JAPAN
          </span>
        </button>
      </div>
    </section>
  );
}
