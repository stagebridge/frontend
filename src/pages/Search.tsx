import { useEffect, useMemo, useState } from "react";
import { useQueryParams } from "../hooks/useQueryParams";
import FiltersSidebar from "../components/Search/FiltersSidebar";
import ResultTabs from "../components/Search/ResultTabs";
import ConcertCard from "../components/common/ConcertCard";
import Pagination from "../components/common/Pagination";

import type { Genre, Region } from "../types/ticket";
import {
  fetchPerformances,
  type PerformanceSummary,
} from "../api/performances";

const PER_PAGE = 12;

// Search UI에서 사용하는 Genre → 공연 API 장르 문자열과 대략 매핑
const matchesGenre = (p: PerformanceSummary, genre: Genre): boolean => {
  const g = (p.genre || "").toLowerCase();

  switch (genre) {
    case "CLASSIC":
      // 클래식
      return g.includes("클래식") || g.includes("서양음악");
    default:
      // 나머지는 일단 대중음악 계열로 묶어서 필터
      return g.includes("대중") || g.includes("발라드") || g.includes("록");
  }
};

export default function Search() {
  const { get, setMany } = useQueryParams<{
    q: string;
    region: Region;
    genre: Genre;
    start: string;
    end: string;
    tab: "all" | "genre" | "region";
    sort: "latest" | "popular" | "priceAsc" | "priceDesc";
    page: string;
  }>();

  const q = (get("q") || "").trim();
  const region = (get("region") as Region | undefined) || undefined;
  const genre = (get("genre") as Genre | undefined) || undefined;
  const start = get("start") || "";
  const end = get("end") || "";
  const tab = ((get("tab") as any) || "all") as "all" | "genre" | "region";
  const sort = ((get("sort") as any) || "latest") as
    | "latest"
    | "popular"
    | "priceAsc"
    | "priceDesc";
  const page = Math.max(1, parseInt(get("page") || "1", 10) || 1);

  // ✅ 실제 공연 데이터(API) 상태
  const [items, setItems] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 마운트 시 한 번만 공연 목록 로드
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPerformances();
        if (!cancelled) {
          setItems(data ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : "공연 정보를 불러오는 중 오류가 발생했습니다.";
          setError(msg);
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
  }, []);

  // ✅ 클라이언트 필터링 (이제 더미 TICKETS 대신 API 결과 사용)
  const filtered = useMemo(() => {
    let rows: PerformanceSummary[] = items;

    // 검색어
    if (q) {
      const keyword = q.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          (p.area ?? "").toLowerCase().includes(keyword) ||
          (p.genre ?? "").toLowerCase().includes(keyword),
      );
    }

    // 지역 필터
    if (region) {
      // 현재는 한국 공연만 있어서,
      // JAPAN 선택 시에는 데이터가 없다고 보는 방식으로 처리.
      if (region === "JAPAN") {
        rows = [];
      } else {
        // KOREA 인 경우는 그대로 둠 (필요하면 area 에서 "서울/부산" 등으로 세분화 가능)
        rows = rows;
      }
    }

    // 장르 필터
    if (genre) {
      rows = rows.filter((p) => matchesGenre(p, genre));
    }

    // 날짜(start/end)는 아직 Summary에 명확한 날짜 필드가 없어서
    // 우선 필터링은 보류 (추후 startDate/endDate 필드가 생기면 여기서 처리)
    // if (start) ...
    // if (end) ...

    // 정렬
    switch (sort) {
      case "latest": {
        // 최신순: period 문자열이 있으면 그걸 기준으로, 없으면 id 기준
        rows = [...rows].sort((a, b) => (b.period > a.period ? 1 : -1));
        break;
      }
      case "popular": {
        // 아직 별도의 인기 지표가 없으므로 임시로 id 길이로 정렬
        rows = [...rows].sort((a, b) => b.id.length - a.id.length);
        break;
      }
      case "priceAsc":
      case "priceDesc": {
        // 가격 정보가 아직 없으므로 정렬만 유지 (실제 값 변화는 없음)
        rows = [...rows];
        break;
      }
    }

    return rows;
  }, [items, q, region, genre, start, end, sort]);

  const total = filtered.length;
  const startIndex = (page - 1) * PER_PAGE;
  const pageRows = filtered.slice(startIndex, startIndex + PER_PAGE);

  const applyFilters = (next: {
    q?: string;
    region?: Region;
    genre?: Genre;
    start?: string;
    end?: string;
  }) => {
    setMany({ ...next, page: "1" }); // 필터 변경 시 1페이지로
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6">
      {/* 상단 배너(더미 이미지지만 UI용이라 그대로 둬도 무방) */}
      <div className="mb-6 overflow-hidden rounded-2xl">
        <img
          className="h-44 w-full object-cover md:h-56"
          src="https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=1600"
          alt="search-banner"
        />
      </div>

      <div className="flex gap-6">
        {/* 좌측 필터 */}
        <FiltersSidebar
          initKeyword={q}
          initRegion={region}
          initGenre={genre}
          initStart={start}
          initEnd={end}
          onApply={applyFilters}
        />

        {/* 우측 결과 */}
        <section className="min-w-0 flex-1">
          <ResultTabs
            active={tab}
            onChange={(v) => setMany({ tab: v, page: "1" })}
            sort={sort}
            onSortChange={(s) => setMany({ sort: s, page: "1" })}
          />

          {/* 검색 요약 */}
          <div className="mb-3 text-sm text-neutral-500">
            총 <b>{total}</b>건
            {q && <> · “{q}”</>}
            {region && <> · {region === "JAPAN" ? "Japan" : "Korea"}</>}
            {genre && <> · {genre}</>}
            {start && <> · {start}~{end || "…"}</>}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="mb-2 text-sm text-red-500">
              공연 정보를 불러오는 중 오류가 발생했습니다: {error}
            </p>
          )}

          {/* 그리드 */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-xl bg-slate-200/60 dark:bg-neutral-800"
                />
              ))}
            </div>
          ) : pageRows.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageRows.map((p) => (
                <ConcertCard key={p.id} item={p} />
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border text-sm text-neutral-500 dark:border-neutral-800">
              조건에 맞는 공연이 없습니다.
            </div>
          )}

          {/* 페이지네이션 */}
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
