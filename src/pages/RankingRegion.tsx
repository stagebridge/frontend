// src/pages/RankingRegion.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Chip from "../components/common/Chip";
import ConcertCard from "../components/common/ConcertCard";
import { GENRES, REGIONS } from "../constants/ranking";
import { fetchPerformances, type PerformanceSummary } from "../api/performances";
import { getRegionGroupFromArea } from "../utils/region";

type Genre = (typeof GENRES)[number];
type RegionGroup = (typeof REGIONS)[number];

const INITIAL_COUNT = 9;
const STEP = 9;

export default function RankingRegion() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const regionFromUrl = (searchParams.get("region") as RegionGroup | null) ?? null;
  const genreFromUrl = (searchParams.get("genre") as Genre | null) ?? null;

  const [activeRegion, setActiveRegion] = useState<RegionGroup>(regionFromUrl ?? "수도권");

  // ✅ 전환 시 유지용(화면에는 노출하지 않음)
  const [activeGenre, setActiveGenre] = useState<Genre>(genreFromUrl ?? "뮤지컬");

  const [all, setAll] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  useEffect(() => {
    if (regionFromUrl) setActiveRegion(regionFromUrl);
    if (genreFromUrl) setActiveGenre(genreFromUrl);
  }, [regionFromUrl, genreFromUrl]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const rows = await fetchPerformances();
        if (!cancelled) setAll(rows);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "공연 정보를 불러오지 못했습니다.";
        if (!cancelled) {
          setAll([]);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeRegion]);

  const items = useMemo(() => {
    return all.filter((p) => getRegionGroupFromArea(p.area) === activeRegion);
  }, [all, activeRegion]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const canLoadMore = visibleCount < items.length;

  const onClickLoadMore = () => {
    setVisibleCount((v) => Math.min(v + STEP, items.length));
  };

  const onPickRegion = (r: RegionGroup) => {
    setActiveRegion(r);

    const qs = new URLSearchParams(searchParams);
    qs.set("region", r);

    // ✅ 장르는 전환 시 유지(표시하지는 않음)
    if (!qs.get("genre")) qs.set("genre", activeGenre);

    setSearchParams(qs);
  };

  const goGenreRanking = () => {
    const qs = new URLSearchParams();
    qs.set("genre", searchParams.get("genre") ?? activeGenre);
    qs.set("region", searchParams.get("region") ?? activeRegion);
    navigate(`/ranking/genre?${qs.toString()}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">전체보기</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            선택한 지역의 전체 목록을 확인할 수 있습니다.
          </p>
        </div>

        <Link
          to="/"
          className="w-fit rounded-lg border px-3 py-2 text-sm text-neutral-700 hover:bg-black/5 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-white/10"
        >
          홈으로
        </Link>
      </header>

      {/* 상단 탭 */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={goGenreRanking}
          className="rounded-full border px-4 py-2 text-sm text-neutral-700 hover:bg-black/5 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-white/10"
        >
          장르별 랭킹
        </button>

        <button
          type="button"
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
          aria-current="page"
        >
          지역별 랭킹
        </button>
      </div>

      {/* ✅ 지역 버튼만 표시 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <Chip key={r} active={activeRegion === r} onClick={() => onPickRegion(r)}>
            {r}
          </Chip>
        ))}
      </div>

      <div className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
        총 {items.length}건
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border p-4 text-sm text-red-600 dark:border-neutral-800 dark:text-red-400">
          {error}
        </div>
      ) : loading && all.length === 0 ? (
        <div className="mt-4 text-sm text-neutral-500">불러오는 중입니다.</div>
      ) : items.length === 0 ? (
        <div className="mt-4 text-sm text-neutral-500">조건에 맞는 공연이 없습니다.</div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((p) => (
          <ConcertCard key={p.id} item={p} />
        ))}
      </div>

      <div className="mt-10">
        {canLoadMore ? (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onClickLoadMore}
              disabled={loading}
              className="group flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-white/10"
            >
              <span>더보기</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                ({visibleItems.length}/{items.length})
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 translate-y-[1px] transition group-hover:translate-y-[2px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        ) : items.length > 0 ? (
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            모든 결과를 확인했습니다.
          </p>
        ) : null}
      </div>
    </main>
  );
}
