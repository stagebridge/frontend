import { useMemo } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import FiltersSidebar from "@/components/Search/FiltersSidebar";
import ResultTabs from "@/components/Search/ResultTabs";
import TicketCard from "@/components/common/Card/TicketCard";
import Pagination from "@/components/common/Pagination";
import { TICKETS } from "@/mocks/tickets.mock";
import type { Genre, Region, Ticket } from "@/types/ticket";

const PER_PAGE = 12;

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

  // 실데이터 연동 전: 클라이언트 필터링
  const filtered = useMemo(() => {
    let rows: Ticket[] = TICKETS;

    if (q) {
      const keyword = q.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          (t.subTitle?.toLowerCase().includes(keyword) ?? false) ||
          t.venue.toLowerCase().includes(keyword)
      );
    }
    if (region) rows = rows.filter((t) => t.region === region);
    if (genre) rows = rows.filter((t) => t.genre === genre);
    if (start) rows = rows.filter((t) => t.dateStart >= start);
    if (end) rows = rows.filter((t) => (t.dateEnd ?? t.dateStart) <= end);

    switch (sort) {
      case "latest":
        rows = [...rows].sort((a, b) => (b.dateStart > a.dateStart ? 1 : -1));
        break;
      case "priceAsc":
        rows = [...rows].sort(
          (a, b) => (a.priceJPY ?? a.priceKRW ?? 0) - (b.priceJPY ?? b.priceKRW ?? 0)
        );
        break;
      case "priceDesc":
        rows = [...rows].sort(
          (a, b) => (b.priceJPY ?? b.priceKRW ?? 0) - (a.priceJPY ?? a.priceKRW ?? 0)
        );
        break;
      case "popular":
        // 더미: id 문자열 길이로 가짜 정렬
        rows = [...rows].sort((a, b) => b.id.length - a.id.length);
        break;
    }

    return rows;
  }, [q, region, genre, start, end, sort]);

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
      {/* 상단 배너(더미) */}
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

          {/* 그리드 */}
          {pageRows.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageRows.map((t) => (
                <TicketCard key={t.id} ticket={t} />
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
