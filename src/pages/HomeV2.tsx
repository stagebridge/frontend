import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import CountryPickerV2 from "../components/HomeV2/CountryPickerV2";
import HotIssueSectionV2 from "../components/HomeV2/HotIssueSectionV2";
import RankingSectionV2 from "../components/HomeV2/RankingSectionV2";

import type { PerformanceSummary } from "../types/performance";

// ⚠️ 아래 훅/데이터는 프로젝트마다 다르므로,
// 기존 HomeV2에서 사용 중인 데이터/핸들러를 그대로 연결하면 됩니다.
type Props = {
  hotIssueItems: PerformanceSummary[];
  rankingItems: PerformanceSummary[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  [key: string]: unknown;
};

export default function HomeV2({
  hotIssueItems,
  rankingItems,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const { t } = useTranslation();

  const heroTitle = useMemo(
    () => t("home.heroTitle", "Find performances across Korea and Japan."),
    [t],
  );
  const heroDesc = useMemo(
    () =>
      t(
        "home.heroDesc",
        "Discover trending shows, compare rankings, and move to booking with a clear flow.",
      ),
    [t],
  );

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* 배경(피그마 느낌): 그라데이션 + 소프트 블러 */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-black/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[420px] w-[420px] rounded-full bg-black/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:py-10">
        {/* 상단(피그마식): 헤더/국가 선택 + 히어로 문구 */}
        <CountryPickerV2 />

        <header className="overflow-hidden rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-wide text-black/50">
              {t("home.heroBadge", "STAGEBRIDGE")}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
              {heroTitle}
            </h1>
            <p className="max-w-[70ch] text-sm leading-6 text-black/60 md:text-base">
              {heroDesc}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black text-white px-3 py-1 text-xs font-semibold">
                {t("home.heroChip1", "Hot Issue")}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                {t("home.heroChip2", "Ranking")}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                {t("home.heroChip3", "Booking Flow")}
              </span>
            </div>
          </div>
        </header>

        <HotIssueSectionV2
          items={hotIssueItems}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        <RankingSectionV2 items={rankingItems} />
      </div>
    </div>
  );
}
