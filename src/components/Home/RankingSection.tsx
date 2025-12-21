import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Chip from "../common/Chip";
import ConcertCard from "../common/ConcertCard";
import { GENRES, REGIONS } from "../../constants/ranking";
import {
  fetchPerformances,
  fetchPerformanceDetail,
  type PerformanceSummary,
} from "../../api/performances";
import { getRegionGroupFromArea } from "../../utils/region";

type Tab = "genre" | "region";
type Genre = (typeof GENRES)[number];

type RegionLiteral = (typeof REGIONS)[number];
type RegionNonNull = Exclude<RegionLiteral, null>;
const REGION_OPTIONS = REGIONS.filter((r): r is RegionNonNull => r !== null);
type RegionGroup = (typeof REGION_OPTIONS)[number];

function buildPosterUrl(item: PerformanceSummary): string {
  return item.posterUrl?.trim()
    ? item.posterUrl
    : "https://placehold.co/600x400?text=No+Image";
}

/**
 * ✅ 장르 표기 흔들림 대응:
 * - "뮤지컬/오페라" → "뮤지컬"로 매칭 가능
 * - 공백/괄호/슬래시 등 분리해서 비교
 */
function matchesGenreValue(rawGenre: string | undefined, selected: Genre): boolean {
  const g = (rawGenre ?? "").trim();
  if (!g) return false;

  if (g === selected) return true;
  if (g.includes(selected)) return true;

  // 구분자 기반 토큰화 (/, ·, ,, 공백, 괄호)
  const tokens = g
    .split(/[\/·,()\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  return tokens.includes(selected);
}

export default function RankingSection() {
  const [tab, setTab] = useState<Tab>("genre");
  const [selectedGenre, setSelectedGenre] = useState<Genre>(GENRES[0]);
  const [selectedRegion, setSelectedRegion] = useState<RegionGroup>(REGION_OPTIONS[0]);
  const [baseItems, setBaseItems] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ 핵심: 목록 응답에 genre가 없을 수 있으므로,
   * 장르 탭에서만 상세 API로 genre를 보강하는 캐시 맵
   */
  const [genreById, setGenreById] = useState<Record<string, string>>({});

  // ✅ 전용 엔드포인트 없이, 기본 목록을 한 번만 로드
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const list = await fetchPerformances();
        if (!ignore) setBaseItems(list);
      } catch {
        if (!ignore) setBaseItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * ✅ 장르 탭에서만 “genre 누락” 항목을 상세로 보강
   * - 과도한 호출 방지를 위해 최대 40개만 보강
   * - 이미 캐시된 id는 다시 호출하지 않음
   */
  useEffect(() => {
    let ignore = false;

    async function enrichGenres() {
      if (tab !== "genre") return;
      if (baseItems.length === 0) return;

      const targets = baseItems
        .filter((p) => !p.genre?.trim())
        .map((p) => p.id)
        .filter((id) => !genreById[id])
        .slice(0, 40);

      if (targets.length === 0) return;

      // ✅ 순차 호출(안정성 우선)
      const updates: Record<string, string> = {};
      for (const id of targets) {
        try {
          const detail = await fetchPerformanceDetail(id);
          const g = (detail.genre ?? "").trim();
          if (g) updates[id] = g;
        } catch {
          // 상세 실패는 무시(개별 실패로 전체 중단 방지)
        }
        if (ignore) return;
      }

      if (!ignore && Object.keys(updates).length > 0) {
        setGenreById((prev) => ({ ...prev, ...updates }));
      }
    }

    enrichGenres();

    return () => {
      ignore = true;
    };
  }, [tab, baseItems, genreById]);

  const filteredItems = useMemo(() => {
    if (tab === "genre") {
      return baseItems.filter((p) => {
        const genre = p.genre?.trim() ? p.genre : genreById[p.id];
        return matchesGenreValue(genre, selectedGenre);
      });
    }

    return baseItems.filter((p) => {
      const group = getRegionGroupFromArea(p.area ?? "");
      return group === selectedRegion;
    });
  }, [baseItems, tab, selectedGenre, selectedRegion, genreById]);

  const visibleItems = useMemo(() => filteredItems.slice(0, 6), [filteredItems]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">랭킹</h2>
        <Link to="/search" className="text-sm text-slate-500 hover:underline">
          전체보기
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("genre")}
          className={`rounded-full px-4 py-2 text-sm ${
            tab === "genre" ? "bg-black text-white" : "border bg-white"
          }`}
        >
          장르별 랭킹
        </button>
        <button
          type="button"
          onClick={() => setTab("region")}
          className={`rounded-full px-4 py-2 text-sm ${
            tab === "region" ? "bg-black text-white" : "border bg-white"
          }`}
        >
          지역별 랭킹
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tab === "genre"
          ? GENRES.map((g) => (
              <Chip key={g} active={g === selectedGenre} onClick={() => setSelectedGenre(g)}>
                {g}
              </Chip>
            ))
          : REGION_OPTIONS.map((r) => (
              <Chip key={r} active={r === selectedRegion} onClick={() => setSelectedRegion(r)}>
                {r}
              </Chip>
            ))}
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-neutral-500">불러오는 중입니다.</div>
      ) : tab === "genre" && baseItems.length > 0 && visibleItems.length === 0 ? (
        <div className="mt-4 text-sm text-neutral-500">
          장르 정보가 목록에 포함되지 않아 상세 조회로 보강 중일 수 있습니다.
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-4 text-sm text-neutral-500">조건에 맞는 공연이 없습니다.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((p) => (
            <li key={p.id}>
              <ConcertCard
                href={`/concerts/${p.id}`}
                title={p.name}
                posterUrl={buildPosterUrl(p)}
                dateLabel={p.period}
                regionLabel={tab === "region" ? (p.area ?? undefined) : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
