import { useEffect, useState } from "react";
import Chip from "../common/Chip";
import ConcertCard from "../common/ConcertCard";
import { GENRES, REGIONS } from "../../constants/ranking";
import { Link } from "react-router-dom";
import {
  fetchPerformancesByGenre,
  type PerformanceSummary,
} from "../../api/performances";

type Tab = "genre" | "region";
type Genre = (typeof GENRES)[number];
type Region = (typeof REGIONS)[number];

const mapGenreLabelToApiParam = (genre: Genre): string => {
  switch (genre) {
    case "클래식":
      return "서양음악(클래식)";
    default:
      return "대중음악";
  }
};

export default function RankingSection() {
  const [tab, setTab] = useState<Tab>("genre");
  const [activeGenre, setActiveGenre] = useState<Genre>(GENRES[0]);
  const [activeRegion, setActiveRegion] = useState<Region>(REGIONS[0]);
  const [items, setItems] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (tab === "region") {
        setItems([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiGenre = mapGenreLabelToApiParam(activeGenre);
        const data = await fetchPerformancesByGenre(apiGenre);

        if (!cancelled) {
          setItems((data ?? []).slice(0, 6)); // 최대 6개 노출
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
          setError(msg);
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, activeGenre, activeRegion]);

  const right = (
    <Link
      to={
        tab === "genre"
          ? `/list?tab=genre&genre=${encodeURIComponent(activeGenre)}`
          : `/list?tab=region&region=${encodeURIComponent(activeRegion)}`
      }
      className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
    >
      전체보기
    </Link>
  );

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
      {/* 상단 탭 */}
      <div className="mb-3 flex items-center gap-4">
        <button
          onClick={() => setTab("genre")}
          className={
            tab === "genre"
              ? "text-[25px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
              : "text-[25px] font-bold tracking-tight text-slate-400 dark:text-slate-500"
          }
        >
          장르별 랭킹
        </button>
        <button
          onClick={() => setTab("region")}
          className={
            tab === "region"
              ? "text-[25px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
              : "text-[25px] font-bold tracking-tight text-slate-400 dark:text-slate-500"
          }
        >
          지역별 랭킹
        </button>

        <div className="flex flex-1 items-center justify-end">{right}</div>
      </div>

      {/* 장르/지역 칩 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tab === "genre"
          ? GENRES.map((g) => (
              <Chip
                key={g}
                active={g === activeGenre}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </Chip>
            ))
          : REGIONS.map((r) => (
              <Chip
                key={r}
                active={r === activeRegion}
                onClick={() => setActiveRegion(r)}
              >
                {r}
              </Chip>
            ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mb-2 text-sm text-red-500">
          공연 정보를 불러오는 중 오류가 발생했습니다: {error}
        </p>
      )}

      {/* 카드 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-60 animate-pulse rounded-xl bg-slate-200/60 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ConcertCard key={item.id} item={item} />
          ))}
          {!error && !loading && items.length === 0 && tab === "region" && (
            <p className="text-sm text-slate-500">
              아직 지역별 랭킹 데이터가 준비되지 않았습니다.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
