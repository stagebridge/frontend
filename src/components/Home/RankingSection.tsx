import { useEffect, useState } from "react";
import Chip from "../common/Chip";
import ConcertCard from "../common/ConcertCard";
import {
  GENRES,
  REGIONS,
  fetchTopByGenre,
  fetchTopByRegion,
} from "../../mocks/ranking.mock";
import { Link } from "react-router-dom";

// 타입 import (mocks 안에 Concert 타입이 있다면 import 해서 쓰고,
// 없다면 아래 toTicket에서 c의 프로퍼티를 optional 로 안전하게 다루면 됩니다)
import type { Ticket, Region as TicketRegion, Genre as TicketGenre } from "../../types/ticket";
// import type { Concert } from "../../mocks/ranking.mock"; // 존재한다면 주석 해제

type Tab = "genre" | "region";
type Genre = (typeof GENRES)[number];
type Region = (typeof REGIONS)[number];

// ---- Concert -> Ticket 변환기 ----
// Concert 구조가 프로젝트마다 다르므로, 없는 필드는 안전하게 기본값 처리했습니다.
// mocks/ranking.mock 의 필드명에 맞춰 image/cover/period 등을 가져오도록 작성했습니다.
const toTicket = (c: any): Ticket => {
  // 기간이 "YYYY.MM.DD ~ YYYY.MM.DD" 형태라면 분리해서 사용
  const [pStart, pEnd] =
    typeof c.period === "string" && c.period.includes("~")
      ? c.period.split("~").map((s: string) => s.trim())
      : ["", ""];

  return {
    id: String(c.id ?? ""),
    title: String(c.title ?? ""),
    subTitle: c.subTitle ?? c.subtitle ?? "",

    // 둘 중 하나가 있으면 사용, 없으면 period 분리값 사용
    dateStart: c.dateStart ?? pStart ?? "",
    dateEnd: c.dateEnd ?? pEnd ?? "",

    priceKRW: c.priceKRW,
    priceJPY: c.priceJPY,

    venue: c.venue ?? "",

    // region / genre 가 mocks 에 없다면 기본값
    region: (c.region ?? "JAPAN") as TicketRegion,
    genre: (c.genre ?? "ETC") as TicketGenre,

    // 이미지 필드명 다양성 대응
    cover: c.cover ?? c.imageUrl ?? c.image ?? "",
  };
};

export default function RankingSection() {
  const [tab, setTab] = useState<Tab>("genre");
  const [activeGenre, setActiveGenre] = useState<Genre>(GENRES[0]);
  const [activeRegion, setActiveRegion] = useState<Region>(REGIONS[0]);
  const [items, setItems] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);

      const raw =
        tab === "genre"
          ? await fetchTopByGenre(activeGenre) // Concert[] (유사)
          : await fetchTopByRegion(activeRegion); // Concert[] (유사)

      // Concert[] -> Ticket[]
      const mapped: Ticket[] = (raw ?? []).map(toTicket);

      if (mounted) {
        setItems(mapped.slice(0, 6)); // 최대 6개만 노출
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
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
      </div>

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
          {items.map((t) => (
            <ConcertCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </section>
  );
}
