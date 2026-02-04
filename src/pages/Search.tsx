// src/pages/Search.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { fetchPerformances, type PerformanceSummary } from "../api/performances";
import ShowCardV2 from "../components/HomeV2/ShowCardV2";
import useFavorites from "../hooks/useFavorites";

import SectionHeaderV2 from "../components/common/SectionHeaderV2";
import EmptyStateV2 from "../components/common/EmptyStateV2";
import SkeletonCardV2 from "../components/common/SkeletonCardV2";

type Country = "KR" | "JP";
type SortKey = "latest" | "endingSoon" | "name";

function buildPosterUrl(item: PerformanceSummary): string {
  return item.posterUrl?.trim() ? item.posterUrl : "https://placehold.co/600x400?text=No+Image";
}

function parseEndDateFromPeriod(period?: string): number {
  if (!period) return Number.POSITIVE_INFINITY;

  const raw = period.replace(/\s/g, "");
  const parts = raw.split("~");
  const end = parts.length >= 2 ? parts[1] : raw;

  const digits = end.replace(/[^\d]/g, "");
  if (digits.length < 8) return Number.POSITIVE_INFINITY;

  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);

  const iso = `${y}-${m}-${d}`;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

function getParam(search: string, key: string): string | null {
  return new URLSearchParams(search).get(key);
}

function setParam(search: string, key: string, value: string): string {
  const qs = new URLSearchParams(search);
  qs.set(key, value);
  return `?${qs.toString()}`;
}

function setParams(search: string, patch: Record<string, string>): string {
  const qs = new URLSearchParams(search);
  for (const [k, v] of Object.entries(patch)) qs.set(k, v);
  return `?${qs.toString()}`;
}

export default function Search() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const country = (getParam(location.search, "country") ?? "KR") as Country;
  const sort = (getParam(location.search, "sort") ?? "latest") as SortKey;
  const page = Math.max(1, Number(getParam(location.search, "page") ?? "1"));
  const tab = (getParam(location.search, "tab") ?? "all").trim();
  const q = (getParam(location.search, "q") ?? "").trim();
  const rankGenre = (getParam(location.search, "rankGenre") ?? "").trim();
  const rankRegion = (getParam(location.search, "rankRegion") ?? "").trim();

  const isJP = country === "JP";

  // ✅ Hook은 조건 분기 전에 항상 호출되어야 합니다.
  const { isFav, toggle } = useFavorites();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<PerformanceSummary[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPerformances();
        if (!ignore) setList(data);
      } catch {
        if (!ignore) {
          setList([]);
          setError("검색 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    // ✅ JP일 때는 데이터 로드 없이 준비중 화면으로 고정
    if (isJP) {
      setLoading(false);
      setError(null);
      setList([]);
      return () => {
        ignore = true;
      };
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [isJP]);

  const filtered = useMemo(() => {
    let items = list;

    if (q) {
      const lower = q.toLowerCase();
      items = items.filter((p) => (p.name ?? "").toLowerCase().includes(lower));
    }

    if (tab === "genre" && rankGenre) {
      items = items.filter((p) => (p.genre ?? "").includes(rankGenre));
    }

    if (tab === "region" && rankRegion) {
      items = items.filter((p) => (p.area ?? "").includes(rankRegion));
    }

    if (sort === "endingSoon") {
      items = [...items].sort((a, b) => parseEndDateFromPeriod(a.period) - parseEndDateFromPeriod(b.period));
    } else if (sort === "name") {
      items = [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else {
      items = [...items];
    }

    return items;
  }, [list, q, tab, rankGenre, rankRegion, sort]);

  const pageSize = 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  const visible = useMemo(() => filtered.slice(start, end), [filtered, start, end]);

  const goPage = (nextPage: number) => {
    const p = Math.max(1, Math.min(nextPage, totalPages));
    navigate(setParam(location.search, "page", String(p)));
  };

  const onChangeCountry = (next: Country) => {
    navigate(
      setParams(location.search, {
        country: next,
        page: "1",
      }),
    );
  };

  const onChangeSort = (next: SortKey) => {
    navigate(
      setParams(location.search, {
        sort: next,
        page: "1",
      }),
    );
  };

  const onSubmitSearch = (keyword: string) => {
    navigate(
      setParams(location.search, {
        q: keyword,
        page: "1",
      }),
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeaderV2
        title="검색"
        description="국가, 정렬, 키워드 조건으로 공연을 찾을 수 있습니다."
        rightSlot={
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:underline dark:text-slate-300"
          >
            홈으로 이동
          </Link>
        }
      />

      {isJP ? (
        <EmptyStateV2
          title={t("comingSoon.title")}
          description={t("comingSoon.description")}
          ctaLabel={t("comingSoon.ctaToKr")}
          ctaTo="/search?country=KR&tab=all&sort=latest&page=1"
        />
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">국가</span>

              <button
                type="button"
                onClick={() => onChangeCountry("KR")}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  country === "KR"
                    ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:bg-neutral-800",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                ].join(" ")}
              >
                한국
              </button>

              <button
                type="button"
                onClick={() => onChangeCountry("JP")}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  country === "JP"
                    ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:bg-neutral-800",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                ].join(" ")}
              >
                일본
              </button>

              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="sort">
                  정렬
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => onChangeSort(e.target.value as SortKey)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200"
                >
                  <option value="latest">최신(기본)</option>
                  <option value="endingSoon">종료 임박</option>
                  <option value="name">이름순</option>
                </select>
              </div>
            </div>

            <SearchBar initialValue={q} onSubmit={onSubmitSearch} />

            {(tab === "genre" && rankGenre) || (tab === "region" && rankRegion) ? (
              <div className="text-xs text-slate-600 dark:text-slate-300">
                적용된 필터:{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {tab === "genre" ? rankGenre : rankRegion}
                </span>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">검색에 실패했습니다.</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
              <div className="mt-4">
                <button type="button" className="sb-btn" onClick={() => window.location.reload()}>
                  새로고침
                </button>
              </div>
            </div>
          ) : loading ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx}>
                  <SkeletonCardV2 />
                </li>
              ))}
            </ul>
          ) : total === 0 ? (
            <EmptyStateV2
              title="조건에 맞는 공연이 없습니다."
              description="키워드를 변경하거나, 필터를 해제한 뒤 다시 시도해 주세요."
              ctaLabel="검색 조건 초기화"
              ctaTo="/search?country=KR&tab=all&sort=latest&page=1"
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                총 <span className="font-semibold text-slate-900 dark:text-slate-50">{total}</span>개 결과
              </div>

              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((p) => (
                  <li key={p.id}>
                    <ShowCardV2
                      id={p.id}
                      title={p.name}
                      posterUrl={buildPosterUrl(p)}
                      period={p.period}
                      area={p.area ?? undefined}
                      badge={p.genre ?? undefined}
                      isFavorite={isFav(p.id)}
                      onToggleFavorite={(id) => {
                        toggle(id);
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => goPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50
                             dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200"
                >
                  이전
                </button>

                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {safePage} / {totalPages}
                </div>

                <button
                  type="button"
                  onClick={() => goPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50
                             dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200"
                >
                  다음
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

function SearchBar({
  initialValue,
  onSubmit,
}: {
  initialValue: string;
  onSubmit: (keyword: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <label className="sr-only" htmlFor="q">
        검색어
      </label>
      <input
        id="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="공연명을 입력해 검색합니다."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900
                   placeholder:text-slate-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-50"
      />

      <button type="submit" className="sb-btn shrink-0">
        검색
      </button>
    </form>
  );
}
