import { useEffect, useState } from "react";
import Chip from "../common/Chip";
import ConcertCard from "../common/ConcertCard";
import { GENRES, REGIONS, fetchTopByGenre, fetchTopByRegion, type Concert } from "@/mocks/ranking.mock";
import { Link } from "react-router-dom";

type Tab = "genre" | "region";
type Genre = (typeof GENRES)[number];
type Region = (typeof REGIONS)[number];

export default function RankingSection() {
  const [tab, setTab] = useState<Tab>("genre");
  const [activeGenre, setActiveGenre] = useState<Genre>(GENRES[0]);
  const [activeRegion, setActiveRegion] = useState<Region>(REGIONS[0]);
  const [items, setItems] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 데이터 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data =
        tab === "genre"
          ? await fetchTopByGenre(activeGenre)
          : await fetchTopByRegion(activeRegion);
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tab, activeGenre, activeRegion]);

  // ✅ "전체보기" 링크
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
      {/* 상단 탭 버튼 */}
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
      </div>

      {/* ✅ "선택하세요" 문구 제거 → 오른쪽 정렬된 전체보기만 표시 */}
      <div className="mb-3 flex justify-end">{right}</div>

      {/* 칩(필터) */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tab === "genre"
          ? GENRES.map((g) => (
              <Chip key={g} active={g === activeGenre} onClick={() => setActiveGenre(g)}>
                {g}
              </Chip>
            ))
          : REGIONS.map((r) => (
              <Chip key={r} active={r === activeRegion} onClick={() => setActiveRegion(r)}>
                {r}
              </Chip>
            ))}
      </div>

      {/* 6개 카드 그리드 */}
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
          {items.map((c) => (
            <ConcertCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </section>
  );
}
