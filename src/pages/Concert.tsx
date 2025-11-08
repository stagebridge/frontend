import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Ticket } from "../types/ticket";
import { getTicketById } from "../mocks/tickets.mock";

// 날짜 범위를 배열로 (YYYY-MM-DD)
function rangeDates(start: string, end?: string) {
  const out: string[] = [];
  if (!start) return out;

  const s = new Date(start);
  const e = end ? new Date(end) : new Date(start);

  const cur = new Date(s);
  while (cur <= e) {
    const y = cur.getFullYear();
    const m = `${cur.getMonth() + 1}`.padStart(2, "0");
    const d = `${cur.getDate()}`.padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export default function Concert() {
  const { id = "" } = useParams();
  const ticket = useMemo<Ticket | undefined>(() => getTicketById(id), [id]);

  // 없을 때 방어
  if (!ticket) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-sm text-neutral-500">해당 공연을 찾을 수 없습니다.</p>
      </main>
    );
  }

  const dates = rangeDates(ticket.dateStart, ticket.dateEnd);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0] ?? ticket.dateStart);

  // 가격 표기
  const priceText =
    ticket.priceJPY != null
      ? `${ticket.priceJPY.toLocaleString()}円`
      : ticket.priceKRW != null
      ? `${ticket.priceKRW.toLocaleString()}원`
      : "-";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* 상단: 좌(대표 이미지) / 우(정보+예매) */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 좌: 대표 이미지 */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border dark:border-neutral-800">
            <img
              src={ticket.cover}
              alt={ticket.title}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {/* 우: 정보 + 가격 + 날짜선택 + 예매 */}
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {ticket.title}
          </h1>
          {ticket.subTitle && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {ticket.subTitle}
            </p>
          )}

          <div className="mt-4 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            <p>
              <span className="inline-block w-16 text-neutral-500">기간</span>
              {ticket.dateEnd
                ? `${ticket.dateStart} ~ ${ticket.dateEnd}`
                : ticket.dateStart}
            </p>
            <p>
              <span className="inline-block w-16 text-neutral-500">지역</span>
              {ticket.region}
            </p>
            <p>
              <span className="inline-block w-16 text-neutral-500">장소</span>
              {ticket.venue}
            </p>
            <p>
              <span className="inline-block w-16 text-neutral-500">가격</span>
              {priceText}
            </p>
          </div>

          {/* 날짜 선택 + 예매 버튼 */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">날짜 선택</label>
            <div className="flex gap-2">
              {/* 피그마는 캘린더 UI지만 우선 Select로 구성 (원하면 datepicker로 교체 가능) */}
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <button
                className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                onClick={() => {
                  // 여기서 예매 로직(모달/링크 이동 등) 연결
                  alert(`예매하기\n- 공연: ${ticket.title}\n- 날짜: ${selectedDate}`);
                }}
              >
                예매하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 탭 영역 */}
      <section className="mt-10">
        <nav className="flex gap-6 border-b pb-2 dark:border-neutral-800">
          <a href="#info" className="text-sm font-medium hover:opacity-80">
            공연정보
          </a>
          <a href="#refund" className="text-sm font-medium hover:opacity-80">
            환불정책
          </a>
          <a href="#reviews" className="text-sm font-medium hover:opacity-80">
            관람후기(999+)
          </a>
          <a href="#wish" className="text-sm font-medium hover:opacity-80">
            기대평(999+)
          </a>
          <a href="#qna" className="text-sm font-medium hover:opacity-80">
            Q&A(38)
          </a>
        </nav>

        {/* 섹션들 – 필요시 실제 데이터와 교체 */}
        <div id="info" className="scroll-mt-20 pt-6">
          <h2 className="mb-3 text-lg font-semibold">공연정보</h2>
          <div className="space-y-6">
            <img
              src={ticket.cover}
              alt="공연 이미지 1"
              className="w-full rounded-xl border dark:border-neutral-800"
            />
            <img
              src={ticket.cover}
              alt="공연 이미지 2"
              className="w-full rounded-xl border dark:border-neutral-800"
            />
          </div>
        </div>

        <div id="refund" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">환불정책</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            예매 후 7일 이내 전액 환불(공연 3일 전까지만 가능) 등 정책을 표시합니다.
          </p>
        </div>

        <div id="reviews" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">관람후기</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            관람객 후기 리스트/평점을 노출합니다. (추후 API 연동)
          </p>
        </div>

        <div id="wish" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">기대평</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            기대평/댓글 UI를 배치합니다. (추후 연동)
          </p>
        </div>

        <div id="qna" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">Q&A</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            예매/관람 관련 Q&A를 표시합니다. (추후 연동)
          </p>
        </div>
      </section>
    </main>
  );
}