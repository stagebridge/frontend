import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { PerformanceSummary } from "../../types/performance";

type Props = {
  items: PerformanceSummary[];
  titleKey?: string; // 기본: home.ranking
  className?: string;
  [key: string]: unknown;
};

export default function RankingSectionV2({
  items,
  titleKey = "home.ranking",
  className = "",
}: Props) {
  const { t } = useTranslation();

  return (
    <section className={`mx-auto w-full max-w-6xl ${className}`}>
      <div className="overflow-hidden rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-7">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-black/50">
            {t("home.rankingLabel", "RANKING")}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-black">
            {t(titleKey, "Ranking")}
          </h2>
          <p className="text-sm leading-6 text-black/60">
            {t(
              "home.rankingDesc",
              "A quick overview of popular performances by rank."
            )}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {items?.length ? (
            items.slice(0, 10).map((it, idx) => (
              <Link
                key={it.id}
                to={`/concerts/${it.id}`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-black/[0.02]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
                  <span className="text-sm font-extrabold">{idx + 1}</span>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/5">
                    {it.posterUrl ? (
                      <img
                        src={it.posterUrl}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-extrabold text-black">
                      {it.title}
                    </p>
                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-black/60">
                      {it.place ? <span className="line-clamp-1">{it.place}</span> : null}
                      {it.period ? <span className="line-clamp-1">{it.period}</span> : null}
                    </div>
                  </div>
                </div>

                <div className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-black/60">
                  <span className="rounded-full bg-black/5 px-2 py-1">
                    {t("home.viewDetail", "View details")}
                  </span>
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl bg-black/5">
              <p className="text-sm font-semibold text-black/50">
                {t("common.empty", "No data.")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
