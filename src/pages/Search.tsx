import { useEffect, useMemo, useState } from "react";
import { useQueryParams } from "../hooks/useQueryParams";

import FiltersSidebar from "../components/Search/FiltersSidebar";
import ResultTabs from "../components/Search/ResultTabs";
import ConcertCard from "../components/common/ConcertCard";
import Pagination from "../components/common/Pagination";
import Chip from "../components/common/Chip";

import {
  fetchPerformances,
  fetchPerformanceDetail,
  type PerformanceSummary,
} from "../api/performances";

import { GENRES, REGIONS, type GenreLabel, type RegionGroup } from "../constants/ranking";
import { getRegionGroupFromArea } from "../utils/region";

const PER_PAGE = 12;

type Country = "KR" | "JP";

function normalizeGenre(raw?: string): string {
  const g = (raw ?? "").trim();
  if (!g) return "";

  const s = g.replace(/\s+/g, "");
  if (s.includes("뮤지컬")) return "뮤지컬";
  if (s.includes("연극")) return "연극";
  if (s.includes("서양음악") || s.includes("클래식")) return "서양음악(클래식)";
  if (s.includes("한국음악") || s.includes("국악")) return "한국음악(국악)";
  if (s.includes("대중음악") || s.includes("콘서트")) return "대중음악";
  if (s.includes("서커스") || s.includes("마술")) return "서커스/마술";
  if (s.includes("복합")) return "복합";

  return g;
}

function matchesGenreLabel(raw: string | undefined, selected: GenreLabel): boolean {
  const ng = normalizeGenre(raw);
  if (!ng) return false;
  if (ng === selected) return true;
  if (ng.includes(selected)) return true;

  const tokens = ng
    .split(/[\/·,()\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  return tokens.includes(selected);
}

export default function Search() {
  const { get, setMany } = useQueryParams<{
    q: string;
    country: Country;

    // 좌측 필터(쿼리)
    genre: GenreLabel;
    region: RegionGroup;

    // 우측 랭킹(쿼리)
    tab: "all" | "genre" | "region";
    sort: "latest" | "popular" | "priceAsc" | "priceDesc";
    page: string;
    rankGenre: GenreLabel;
    rankRegion: RegionGroup;
  }>();

  const q = (get("q") || "").trim();
  const country = ((get("country") as any) || "KR") as Country;

  const sidebarGenre = (get("genre") as GenreLabel | undefined) || undefined;
  const sidebarRegion = (get("region") as RegionGroup | undefined) || undefined;

  const tab = ((get("tab") as any) || "all") as "all" | "genre" | "region";
  const sort = ((get("sort") as any) || "latest") as
    | "latest"
    | "popular"
    | "priceAsc"
    | "priceDesc";

  const page = Math.max(1, parseInt(get("page") || "1", 10) || 1);

  const rankGenre = ((get("rankGenre") as any) || GENRES[0]) as GenreLabel;
  const rankRegion = ((get("rankRegion") as any) || REGIONS[0]) as RegionGroup;

  const [items, setItems] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장르 보강 캐시: id -> normalized genre
  const [genreById, setGenreById] = useState<Record<string, string>>({});

  // 랭킹 클릭 시 “좌측 필터 제거”를 setMany 한 번에 합치기 위한 헬퍼
  const wipeSidebarFilterParams = () => ({
    q: undefined,
    genre: undefined,
    region: undefined,
  });

  // 목록 fetch
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPerformances();
        if (!cancelled) setItems(data ?? []);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "공연 정보를 불러오는 중 오류가 발생했습니다.";
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

  /**
   * ✅ 장르 보강(enrich)
   * - 기존: tab === "genre"일 때만 보강
   * - 개선: 좌측 장르 필터(sidebarGenre)가 선택되어도 보강(“결과 없음” 완화)
   */
  useEffect(() => {
    let cancelled = false;

    async function enrichGenreIfNeeded() {
      if (tab !== "genre" && !sidebarGenre) return;
      if (items.length === 0) return;

      const targets = items
        .filter((p) => !normalizeGenre(p.genre))
        .map((p) => p.id)
        .filter((id) => !genreById[id])
        .slice(0, 40);

      if (targets.length === 0) return;

      const updates: Record<string, string> = {};

      for (const id of targets) {
        try {
          const detail = await fetchPerformanceDetail(id);
          const g = normalizeGenre(detail.genre);
          if (g) updates[id] = g;
        } catch {
          // 개별 실패는 무시
        }
        if (cancelled) return;
      }

      if (!cancelled && Object.keys(updates).length > 0) {
        setGenreById((prev) => ({ ...prev, ...updates }));
      }
    }

    enrichGenreIfNeeded();

    return () => {
      cancelled = true;
    };
  }, [tab, sidebarGenre, items, genreById]);

  const filtered = useMemo(() => {
    let rows: PerformanceSummary[] = items;

    // 국가(현재 JP는 비워둠: 백엔드 준비 전)
    if (country === "JP") rows = [];

    // 키워드
    if (q) {
      const keyword = q.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          (p.area ?? "").toLowerCase().includes(keyword) ||
          (p.genre ?? "").toLowerCase().includes(keyword),
      );
    }

    // 좌측: 장르
    if (sidebarGenre) {
      rows = rows.filter((p) => {
        const g = normalizeGenre(p.genre) || genreById[p.id];
        return matchesGenreLabel(g, sidebarGenre);
      });
    }

    // 좌측: 지역
    if (sidebarRegion) {
      rows = rows.filter((p) => getRegionGroupFromArea(p.area) === sidebarRegion);
    }

    // 우측: 랭킹
    if (tab === "genre") {
      rows = rows.filter((p) => {
        const g = normalizeGenre(p.genre) || genreById[p.id];
        return matchesGenreLabel(g, rankGenre);
      });
    } else if (tab === "region") {
      rows = rows.filter((p) => getRegionGroupFromArea(p.area) === rankRegion);
    }

    // 정렬(안전)
    switch (sort) {
      case "latest": {
        rows = [...rows].sort((a, b) => {
          const ap = a.period ?? "";
          const bp = b.period ?? "";
          if (bp === ap) return 0;
          return bp > ap ? 1 : -1;
        });
        break;
      }
      case "popular": {
        rows = [...rows].sort((a, b) => b.id.length - a.id.length);
        break;
      }
      case "priceAsc":
      case "priceDesc": {
        rows = [...rows];
        break;
      }
    }

    return rows;
  }, [
    items,
    country,
    q,
    sidebarGenre,
    sidebarRegion,
    tab,
    rankGenre,
    rankRegion,
    sort,
    genreById,
  ]);

  const total = filtered.length;
  const startIndex = (page - 1) * PER_PAGE;
  const pageRows = filtered.slice(startIndex, startIndex + PER_PAGE);

  // 탭 변경
  const handleTabChange = (v: "all" | "genre" | "region") => {
    if (v === "all") {
      setMany({
        ...wipeSidebarFilterParams(),
        tab: "all",
        rankGenre: undefined,
        rankRegion: undefined,
        page: "1",
      });
      return;
    }

    setMany({
      ...wipeSidebarFilterParams(),
      tab: v,
      page: "1",
    });
  };

  const handleRankGenreClick = (g: GenreLabel) => {
    setMany({
      ...wipeSidebarFilterParams(),
      tab: "genre",
      rankGenre: g,
      page: "1",
    });
  };

  const handleRankRegionClick = (r: RegionGroup) => {
    setMany({
      ...wipeSidebarFilterParams(),
      tab: "region",
      rankRegion: r,
      page: "1",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6">
      <div className="mb-6 overflow-hidden rounded-2xl">
        <img
          className="h-44 w-full object-cover md:h-56"
          src="https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=1600"
          alt="search-banner"
        />
      </div>

      <div className="flex gap-6">
        <FiltersSidebar />

        <section className="min-w-0 flex-1">
          <ResultTabs
            active={tab}
            onChange={handleTabChange}
            sort={sort}
            onSortChange={(s) => setMany({ sort: s, page: "1" })}
          />

          {tab === "genre" && (
            <div className="mb-5 flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip key={g} active={g === rankGenre} onClick={() => handleRankGenreClick(g)}>
                  {g}
                </Chip>
              ))}
            </div>
          )}

          {tab === "region" && (
            <div className="mb-5 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Chip key={r} active={r === rankRegion} onClick={() => handleRankRegionClick(r)}>
                  {r}
                </Chip>
              ))}
            </div>
          )}

          <div className="mb-3 text-sm text-neutral-500">
            총 <b>{total}</b>건
            {q && <> · “{q}”</>}
          </div>

          {(tab === "genre" || sidebarGenre) && total === 0 && (
            <p className="mb-3 text-xs text-neutral-400">
              장르 정보가 목록에 없을 수 있어, 일부 항목을 상세 조회로 보강 중입니다.
            </p>
          )}

          {error && (
            <p className="mb-2 text-sm text-red-500">
              공연 정보를 불러오는 중 오류가 발생했습니다: {error}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-200/60" />
              ))}
            </div>
          ) : pageRows.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageRows.map((p) => (
                <ConcertCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border text-sm text-neutral-500">
              조건에 맞는 공연이 없습니다.
            </div>
          )}

          <Pagination
            page={page}
            total={total}
            perPage={PER_PAGE}
            onChange={(next) => setMany({ page: String(next) })}
          />
        </section>
      </div>
    </div>
  );
}
