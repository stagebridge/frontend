// src/pages/Concert.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPerformanceDetail, type PerformanceDetail } from "../api/performances";
import DetailImagesSection from "../components/concert-detail/DetailImagesSection";
import BoardSection from "../components/concert-detail/BoardSection";

type ViewModel = {
  id: string;
  title: string;
  period: string | null;
  area: string | null;
  genre: string | null;
  venue: string | null;
  posterUrl: string | null;

  // 이용 안내
  age: string | null;
  runtime: string | null;
  guideTime: string | null;

  // 날짜 범위(옵션 생성용)
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
};

function toText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

function toYmd(v: unknown): string | null {
  const s = toText(v);
  if (!s) return null;

  // "2025-11-01T00:00:00.000Z" 같은 값 대응
  const ymd = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;

  return null;
}

function formatPeriod(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && end) return `${start} ~ ${end}`;
  return start ?? end ?? null;
}

function buildDateOptions(startYmd: string | null, endYmd: string | null): string[] {
  if (!startYmd || !endYmd) return [];

  const start = new Date(`${startYmd}T00:00:00`);
  const end = new Date(`${endYmd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  if (start.getTime() > end.getTime()) return [];

  const out: string[] = [];
  const cur = new Date(start);

  // 안전 장치: 너무 긴 기간 방지(예: 잘못된 데이터)
  const MAX_DAYS = 370;

  let guard = 0;
  while (cur.getTime() <= end.getTime() && guard < MAX_DAYS) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }

  return out;
}

function toViewModel(detail: PerformanceDetail, fallbackId: string): ViewModel {
  const anyDetail = detail as any;

  const id = String(anyDetail?.id ?? anyDetail?.mt20id ?? fallbackId);
  const title = String(anyDetail?.name ?? anyDetail?.prfnm ?? "공연명");

  const startDate =
    toYmd(anyDetail?.startDate) ??
    toYmd(anyDetail?.prfpdfrom) ??
    (typeof anyDetail?.period === "string" ? toYmd(anyDetail.period.split("~")[0]?.trim()) : null);

  const endDate =
    toYmd(anyDetail?.endDate) ??
    toYmd(anyDetail?.prfpdto) ??
    (typeof anyDetail?.period === "string" ? toYmd(anyDetail.period.split("~")[1]?.trim()) : null);

  const period = toText(anyDetail?.period) ?? formatPeriod(startDate, endDate);

  const area = toText(anyDetail?.area ?? anyDetail?.areaNm);
  const genre = toText(anyDetail?.genre ?? anyDetail?.genrenm);
  const venue = toText(anyDetail?.venue ?? anyDetail?.fcltynm);
  const posterUrl = toText(anyDetail?.posterUrl ?? anyDetail?.poster);

  const age = toText(anyDetail?.age ?? anyDetail?.prfage);
  const runtime = toText(anyDetail?.runtime ?? anyDetail?.prfruntime);
  const guideTime = toText(anyDetail?.guideTime ?? anyDetail?.dtguidance);

  return {
    id,
    title,
    period,
    area,
    genre,
    venue,
    posterUrl,
    age,
    runtime,
    guideTime,
    startDate,
    endDate,
  };
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Concert() {
  const { id = "" } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<PerformanceDetail | null>(null);

  // 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 임시 카운트(로컬 스토리지 기반)
  const [counts, setCounts] = useState({ reviews: 0, expectations: 0, qa: 0 });

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetchPerformanceDetail(id);
        if (ignore) return;
        setRaw(res);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  // 게시글 수(현재는 BoardSection이 localStorage를 쓰므로, 여기서도 같은 방식으로 카운트 계산)
  useEffect(() => {
    if (!id) return;

    const readCount = (kind: "reviews" | "expectations" | "qa") => {
      try {
        const key = `sb_board_${kind}_${id}`;
        const v = localStorage.getItem(key);
        if (!v) return 0;
        const arr = JSON.parse(v);
        return Array.isArray(arr) ? arr.length : 0;
      } catch {
        return 0;
      }
    };

    const sync = () => {
      setCounts({
        reviews: readCount("reviews"),
        expectations: readCount("expectations"),
        qa: readCount("qa"),
      });
    };

    sync();
    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, [id]);

  const detail = useMemo(() => {
    if (!raw) return null;
    return toViewModel(raw, id);
  }, [raw, id]);

  const detailImages = useMemo(() => {
    const anyDetail = raw as any;
    const styurls = Array.isArray(anyDetail?.styurls) ? anyDetail.styurls : [];
    const images = Array.isArray(anyDetail?.images) ? anyDetail.images : [];
    return (styurls.length ? styurls : images).filter((v: any) => typeof v === "string" && v.trim().length);
  }, [raw]);

  const dateOptions = useMemo(() => {
    if (!detail) return [];
    return buildDateOptions(detail.startDate, detail.endDate);
  }, [detail]);

  // 페이지 진입/상세 로딩 후: 저장된 날짜 복원 or 기본값 선택
  useEffect(() => {
    if (!detail) return;

    const key = `sb_selected_date_${detail.id}`;
    const saved = localStorage.getItem(key);

    if (saved && dateOptions.includes(saved)) {
      setSelectedDate(saved);
      return;
    }

    if (dateOptions.length > 0) {
      setSelectedDate(dateOptions[0]);
    } else {
      setSelectedDate("");
    }
  }, [detail, dateOptions]);

  const onReserve = () => {
    if (!detail) return;

    if (!selectedDate) {
      alert("날짜를 선택해 주세요.");
      return;
    }

    // Reserve 페이지에서 활용할 수 있도록 저장
    localStorage.setItem(`sb_selected_date_${detail.id}`, selectedDate);
    nav(`/reserve/${detail.id}`);
  };

  if (loading && !detail) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-sm text-neutral-600">불러오는 중입니다.</div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-sm text-neutral-600">공연 정보를 불러오지 못했습니다.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* 상단 요약 */}
      <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="w-full">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border bg-white">
            {detail.posterUrl ? (
              <img src={detail.posterUrl} alt={`${detail.title} 포스터`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-neutral-500">포스터가 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">{detail.title}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {detail.genre ? (
              <span className="rounded-full border px-3 py-1 text-xs font-semibold text-neutral-700">{detail.genre}</span>
            ) : null}
            {detail.area ? (
              <span className="rounded-full border px-3 py-1 text-xs font-semibold text-neutral-700">{detail.area}</span>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-6">
            <div className="grid gap-2 text-sm text-neutral-800">
              <div className="grid grid-cols-[72px_1fr] gap-3">
                <div className="text-neutral-500">기간</div>
                <div>{detail.period ?? "-"}</div>
              </div>
              <div className="grid grid-cols-[72px_1fr] gap-3">
                <div className="text-neutral-500">공연장</div>
                <div>{detail.venue ?? "정보가 등록되지 않았습니다."}</div>
              </div>
            </div>

            {/* ✅ 날짜 선택 복구 */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-neutral-900">날짜 선택</div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <select
                  className="h-10 w-full rounded-xl border bg-white px-3 text-sm text-neutral-900 sm:w-[260px]"
                  value={selectedDate}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedDate(v);
                    localStorage.setItem(`sb_selected_date_${detail.id}`, v);
                  }}
                  disabled={dateOptions.length === 0}
                >
                  {dateOptions.length === 0 ? (
                    <option value="">선택 가능한 날짜가 없습니다.</option>
                  ) : (
                    dateOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))
                  )}
                </select>

                <button
                  type="button"
                  className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white"
                  onClick={onReserve}
                >
                  예매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상단 내비게이션(스크롤 이동) */}
      <section className="mt-10 border-b">
        <div className="flex flex-wrap gap-6 text-sm">
          <button type="button" className="py-3 text-neutral-700" onClick={() => scrollToSection("section-info")}>
            공연정보
          </button>
          <button type="button" className="py-3 text-neutral-700" onClick={() => scrollToSection("section-guide")}>
            이용 안내
          </button>
          <button type="button" className="py-3 text-neutral-700" onClick={() => scrollToSection("section-reviews")}>
            관람후기({counts.reviews})
          </button>
          <button type="button" className="py-3 text-neutral-700" onClick={() => scrollToSection("section-expect")}>
            기대평({counts.expectations})
          </button>
          <button type="button" className="py-3 text-neutral-700" onClick={() => scrollToSection("section-qa")}>
            Q&amp;A({counts.qa})
          </button>
        </div>
      </section>

      {/* ✅ 이용 안내: 위쪽 간격 추가 */}
      <section id="section-guide" className="scroll-mt-24 mt-14">
        <h2 className="text-base font-extrabold text-neutral-900">이용 안내</h2>

        <div className="mt-4 rounded-2xl border bg-white p-6">
          <div className="space-y-2 text-sm text-neutral-800">
            <p>
              <span className="font-semibold">관람연령</span>: {detail.age ?? "정보가 등록되지 않았습니다."}
            </p>
            <p>
              <span className="font-semibold">러닝타임</span>: {detail.runtime ?? "정보가 등록되지 않았습니다."}
            </p>
            <p>
              <span className="font-semibold">공연시간 안내</span>: {detail.guideTime ?? "정보가 등록되지 않았습니다."}
            </p>
          </div>

          <div className="my-6 border-t" />

          <div className="text-sm">
            <p className="font-semibold text-neutral-900">유의사항</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-700">
              <li>예매, 취소, 및 환불 규정은 예매처 정책에 따릅니다.</li>
              <li>공연 당일 현장 상황에 따라 일정이 변동될 수 있습니다.</li>
              <li>상세 좌석, 및 회차 정보는 예매 단계에서 확인해 주세요.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 공연정보 */}
      <section id="section-info" className="scroll-mt-24 mt-14">
        <h2 className="text-base font-extrabold text-neutral-900">공연정보</h2>

        <div className="mt-4 space-y-2 text-sm text-neutral-800">
          <p>
            <span className="font-semibold">공연장</span>: {detail.venue ?? "정보가 등록되지 않았습니다."}
          </p>
          <p>
            <span className="font-semibold">출연진</span>: 정보가 등록되지 않았습니다.
          </p>
          <p>
            <span className="font-semibold">제작진</span>: 정보가 등록되지 않았습니다.
          </p>
        </div>
      </section>

      {/* 상세 이미지(styurls) */}
      <section id="section-images" className="scroll-mt-24 mt-14">
        <DetailImagesSection images={detailImages} />
      </section>

      {/* 관람후기 */}
      <section id="section-reviews" className="scroll-mt-24 mt-14">
        <BoardSection performanceId={detail.id} kind="reviews" title="관람후기" />
      </section>

      {/* 기대평 */}
      <section id="section-expect" className="scroll-mt-24 mt-14">
        <BoardSection performanceId={detail.id} kind="expectations" title="기대평" />
      </section>

      {/* QnA */}
      <section id="section-qa" className="scroll-mt-24 mt-14 pb-20">
        <BoardSection performanceId={detail.id} kind="qa" title="Q&amp;A" />
      </section>
    </main>
  );
}
