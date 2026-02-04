import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import useFavorites from "../hooks/useFavorites";
import { fetchPerformanceDetail, type PerformanceDetail } from "../api/performances";
import ShowCardV2 from "../components/HomeV2/ShowCardV2";

import SectionHeaderV2 from "../components/common/SectionHeaderV2";
import EmptyStateV2 from "../components/common/EmptyStateV2";
import SkeletonCardV2 from "../components/common/SkeletonCardV2";

function buildPosterUrl(item: PerformanceDetail): string {
  return item.posterUrl?.trim() ? item.posterUrl : "https://placehold.co/600x400?text=No+Image";
}

async function mapWithConcurrency<T, R>(
  items: T[],
  runningLimit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const limit = Math.max(1, Math.floor(runningLimit));
  const results: R[] = new Array(items.length);

  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export default function Favorites() {
  const { favorites, isFav, toggle } = useFavorites();

  const ids = useMemo(() => {
    return Array.from(favorites).map((v) => v.trim()).filter(Boolean).sort();
  }, [favorites]);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PerformanceDetail[]>([]);
  const [failedIds, setFailedIds] = useState<string[]>([]);

  const lastSignatureRef = useRef<string>("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      const signature = ids.join("|");

      if (ids.length === 0) {
        lastSignatureRef.current = signature;
        setItems([]);
        setFailedIds([]);
        setLoading(false);
        return;
      }

      if (lastSignatureRef.current === signature) return;
      lastSignatureRef.current = signature;

      const targetIds = ids.slice(0, 50);
      setLoading(true);

      try {
        const results = await mapWithConcurrency(
          targetIds,
          5,
          async (id) => {
            try {
              const detail = await fetchPerformanceDetail(id);
              return { ok: true as const, id, detail };
            } catch {
              return { ok: false as const, id, detail: null };
            }
          },
        );

        if (ignore) return;

        const okItems: PerformanceDetail[] = [];
        const failed: string[] = [];

        for (const r of results) {
          if (r.ok && r.detail) okItems.push(r.detail);
          else failed.push(r.id);
        }

        okItems.reverse();

        setItems(okItems);
        setFailedIds(failed);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [ids]);

  const onToggleFavorite = (id: string) => {
    const nowFav = toggle(id);
    if (!nowFav) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      setFailedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeaderV2
        title="찜 목록"
        description="하트로 저장한 공연만 모아서 볼 수 있습니다."
        rightSlot={
          <Link
            to="/search?country=KR&tab=all&sort=latest&page=1"
            className="text-sm font-medium text-slate-600 hover:underline dark:text-slate-300"
          >
            공연 더 찾기
          </Link>
        }
      />

      {ids.length === 0 ? (
        <EmptyStateV2
          title="아직 찜한 공연이 없습니다."
          description="홈 또는 검색 화면에서 하트를 눌러 찜 목록을 만들어 보세요."
          ctaLabel="검색으로 이동"
          ctaTo="/search?country=KR&tab=all&sort=latest&page=1"
        />
      ) : items.length === 0 && loading ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(6, ids.length) }).map((_, idx) => (
            <li key={idx}>
              <SkeletonCardV2 />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {failedIds.length > 0 ? (
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200">
              일부 공연 정보를 불러오지 못했습니다. (개수: {failedIds.length})
            </div>
          ) : null}

          {loading ? (
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
              목록을 갱신하는 중입니다.
            </div>
          ) : null}

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.id}>
                <ShowCardV2
                  id={p.id}
                  title={p.name}
                  posterUrl={buildPosterUrl(p)}
                  period={p.period}
                  area={p.area ?? undefined}
                  badge={p.genre ?? undefined}
                  isFavorite={isFav(p.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </li>
            ))}
          </ul>

          <div className="mt-8 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-50">총 </span>
            {ids.length}개 찜됨
            {ids.length > 50 ? <span className="ml-2">(성능을 위해 상위 50개까지만 표시합니다.)</span> : null}
          </div>
        </>
      )}
    </main>
  );
}
