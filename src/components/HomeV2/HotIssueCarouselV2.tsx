import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { PerformanceSummary } from "../../types/performance";

type Props = {
  items: PerformanceSummary[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
  [key: string]: unknown;
};

export default function HotIssueCarouselV2({
  items,
  scrollRef,
  isFavorite,
  onToggleFavorite,
  className = "",
}: Props) {
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={t("home.hotIssue", "Hot Issue")}
      >
        {items.map((it) => {
          const fav = isFavorite(it.id);

          return (
            <div
              key={it.id}
              className="min-w-[260px] max-w-[260px] flex-shrink-0"
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5">
                <Link to={`/concerts/${it.id}`} className="block">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black/5">
                    {/* 이미지가 없을 때도 레이아웃이 무너지지 않도록 */}
                    {it.posterUrl ? (
                      <img
                        src={it.posterUrl}
                        alt={it.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xs font-semibold text-black/40">
                          {t("common.noImage", "No Image")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-black">
                        {it.title}
                      </h3>

                      <button
                        type="button"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/10 transition ${
                          fav ? "bg-black text-white" : "bg-white hover:bg-black/5"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          onToggleFavorite(it.id);
                        }}
                        aria-label={
                          fav
                            ? t("favorite.remove", "Remove from favorites")
                            : t("favorite.add", "Add to favorites")
                        }
                      >
                        <span aria-hidden>{fav ? "★" : "☆"}</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-black/60">
                      {it.place ? (
                        <p className="line-clamp-1">{it.place}</p>
                      ) : null}
                      {it.period ? (
                        <p className="line-clamp-1">{it.period}</p>
                      ) : null}
                    </div>

                    <div className="mt-1 inline-flex items-center gap-2">
                      <span className="rounded-full bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/70">
                        {t("home.viewDetail", "View details")}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* 카드 상단 그라데이션 오버레이(피그마 느낌) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
