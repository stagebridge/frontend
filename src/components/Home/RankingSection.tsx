// src/components/Home/RankingSection.tsx
import { Link } from "react-router-dom";

export default function RankingSection() {
  const cardBase =
    "group rounded-2xl border p-6 transition focus:outline-none focus-visible:ring-2";
  const cardLight =
    "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-slate-400";
  const cardDark =
    "dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/7 dark:hover:-translate-y-0.5 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:focus-visible:ring-white/30";

  return (
    <section className="pt-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            랭킹
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            인기 공연을 한눈에 확인합니다.
          </p>
        </div>

        {/* 피그마처럼 우측에 “보기” 버튼이 필요하면 여기에서 확장 가능 */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            종합 보기
          </span>
          <span className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            카테고리 보기
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/ranking/genre" className={`${cardBase} ${cardLight} ${cardDark}`}>
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
            RANKING
          </div>
          <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            장르별 랭킹
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            뮤지컬, 연극, 콘서트 등 장르 기준으로 인기 공연을 확인합니다.
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            바로 보기 →
          </div>
        </Link>

        <Link to="/ranking/region" className={`${cardBase} ${cardLight} ${cardDark}`}>
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
            RANKING
          </div>
          <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            지역별 랭킹
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            수도권, 영남권 등 지역 기준으로 인기 공연을 확인합니다.
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            바로 보기 →
          </div>
        </Link>
      </div>
    </section>
  );
}
