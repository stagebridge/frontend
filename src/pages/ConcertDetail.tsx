import { useMemo } from "react";
import { useParams } from "react-router-dom";

type ConcertLike = {
  id: string;
  title: string;
  imageUrl?: string;
  dateStart?: string;
  dateEnd?: string;
  venue?: string;
  price?: string;
};

function useConcert(id?: string): ConcertLike | null {
  return useMemo(() => {
    if (!id) return null;
    return {
      id,
      title: "IVE WORLD TOUR [SHOW WHAT I AM]",
      imageUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1500",
      dateStart: "2025-09-01",
      dateEnd: "2025-10-02",
      venue: "Kアリーナ 横浜",
      price: "25,000円",
    };
  }, [id]);
}

export default function ConcertDetail() {
  const { id } = useParams<{ id: string }>();
  const c = useConcert(id);
  if (!c) return <div className="mx-auto max-w-6xl px-4">데이터가 없습니다.</div>;

  const period =
    c.dateStart && c.dateEnd ? `${c.dateStart} ~ ${c.dateEnd}` : c.dateStart ?? "";

  return (
    <main className="pb-20">
      {/* 상단: 2열 레이아웃 */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        {/* 좌: 320~520px 고정폭, 우: 420px 패널 */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(320px,520px)_420px] lg:gap-16">
          {/* 좌측: 정사각형 이미지 카드 */}
          <div className="rounded-2xl border bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {/* aspect-square 로 정사각형 보장 + style(호환성 보강) */}
            <div
              className="relative aspect-square w-full overflow-hidden rounded-xl border dark:border-neutral-800"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={c.imageUrl}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* 우측: 정보 패널 (sticky) */}
          <aside className="top-6 h-max rounded-2xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:sticky">
            <h1 className="text-2xl font-extrabold tracking-tight">{c.title}</h1>
            <p className="mt-2 text-sm text-neutral-500">
              KAWAIILAB. 3rd Anniversary Special LIVE
            </p>

            <div className="mt-4 space-y-1 text-sm">
              {period && <div>{period}</div>}
              {c.venue && <div>{c.venue}</div>}
              {/* 가격 강조 */}
              {c.price && (
                <div className="font-bold text-xl text-neutral-900 dark:text-white">
                  {c.price}
                </div>
              )}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">날짜 선택</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>

            <button className="mt-4 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-black">
              예매하기
            </button>
          </aside>
        </div>
      </section>

      {/* 탭 내비 */}
      <nav className="mx-auto mt-10 max-w-6xl px-4">
        <ul className="flex gap-6 overflow-x-auto border-b pb-3 text-sm dark:border-neutral-800">
          <li>
            <a
              href="#section-info"
              className="inline-block border-b-2 border-black pb-2 font-medium dark:border-white"
            >
              공연정보
            </a>
          </li>
          <li>
            <a
              href="#section-sale"
              className="inline-block pb-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              판매정보
            </a>
          </li>
          <li>
            <a
              href="#section-reviews"
              className="inline-block pb-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              관람후기(999+)
            </a>
          </li>
          <li>
            <a
              href="#section-wish"
              className="inline-block pb-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              기대평(999+)
            </a>
          </li>
          <li>
            <a
              href="#section-qa"
              className="inline-block pb-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Q&A(38)
            </a>
          </li>
        </ul>
      </nav>

      {/* 섹션들 */}
      <section id="section-info" className="mx-auto max-w-6xl px-4 pt-6">
        <LargePhoto src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1500" />
        <LargePhoto src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1500" />
      </section>

      <section id="section-sale" className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="mb-4 text-lg font-semibold">판매정보</h2>
        <div className="rounded-xl border p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          예매처, 발권/환불 규정 등…
        </div>
      </section>
    </main>
  );
}

function LargePhoto({ src }: { src: string }) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl border dark:border-neutral-800">
      <img src={src} alt="" className="w-full object-cover" loading="lazy" />
    </div>
  );
}
