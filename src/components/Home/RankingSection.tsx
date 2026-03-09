// src/components/Home/RankingSection.tsx
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function RankingSection() {
  const { t } = useTranslation();
  const cardBase =
    "group rounded-2xl border p-6 transition focus:outline-none focus-visible:ring-2 sb-hover-lift";
  const cardLight =
    "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-slate-400";
  const cardDark =
    "dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/7 dark:hover:-translate-y-0.5 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:focus-visible:ring-white/30";

  return (
    <section className="pt-16">
      <div className="sb-animate-rise">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t("ui.home.rankingTitle")}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          {t("ui.home.rankingDescription")}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/ranking/genre"
          className={`${cardBase} ${cardLight} ${cardDark} sb-animate-rise sb-animate-delay-1`}
        >
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
            {t("ui.home.rankingBadge")}
          </div>
          <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            {t("ui.ranking.tabGenre")}
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t("ui.home.genreRankingDescription")}
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            <span className="inline-flex items-center gap-1">
              {t("ui.home.viewNow")}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </Link>

        <Link
          to="/ranking/region"
          className={`${cardBase} ${cardLight} ${cardDark} sb-animate-rise sb-animate-delay-2`}
        >
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
            {t("ui.home.rankingBadge")}
          </div>
          <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            {t("ui.ranking.tabRegion")}
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t("ui.home.regionRankingDescription")}
          </div>
          <div className="mt-4 text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
            <span className="inline-flex items-center gap-1">
              {t("ui.home.viewNow")}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
