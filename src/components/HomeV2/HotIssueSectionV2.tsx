import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import type { PerformanceSummary } from "../../types/performance";
import HotIssueCarouselV2 from "./HotIssueCarouselV2";

type Props = {
  items: PerformanceSummary[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  className?: string;
  /** 기존 호출부 호환을 위해 여분 props 허용 */
  [key: string]: unknown;
};

export default function HotIssueSectionV2({
  items,
  isFavorite,
  onToggleFavorite,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canScroll = useMemo(() => (items?.length ?? 0) > 0, [items]);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;

    // 카드 폭(260) + gap(16) 기준
    const delta = 276 * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className={`mx-auto w-full max-w-6xl ${className}`}>
      <div className="overflow-hidden rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-black/50">
              {t("home.hotIssueLabel", "TRENDING")}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-black">
              {t("home.hotIssue", "Hot Issue")}
            </h2>
            <p className="max-w-[52ch] text-sm leading-6 text-black/60">
              {t(
                "home.hotIssueDesc",
                "Right now, the performances users are paying attention to."
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10 transition hover:bg-black/5 disabled:opacity-50"
              onClick={() => scrollByCard("prev")}
              disabled={!canScroll}
              aria-label={t("common.prev", "Previous")}
            >
              <span aria-hidden>←</span>
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/10 transition hover:bg-black/5 disabled:opacity-50"
              onClick={() => scrollByCard("next")}
              disabled={!canScroll}
              aria-label={t("common.next", "Next")}
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        <div className="mt-5">
          {items?.length ? (
            <HotIssueCarouselV2
              items={items}
              scrollRef={scrollRef}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          ) : (
            <div className="flex min-h-[140px] items-center justify-center rounded-2xl bg-black/5">
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
