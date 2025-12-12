// src/pages/Concert.tsx

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchPerformanceDetail,
  type PerformanceDetail,
  type PerformanceSummary,
} from "../api/performances";

type LocationState = {
  performance?: PerformanceSummary;
};

// 상세 정보 + (선택) 요약 정보를 모두 담을 수 있는 타입
type PerformanceLike = PerformanceDetail | PerformanceSummary;

export default function Concert() {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // 카드에서 넘어온 요약 정보가 있으면 그걸로 먼저 채워 둠
  const [performance, setPerformance] = useState<PerformanceLike | null>(
    state?.performance ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    state?.performance?.period ?? "",
  );

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const detail = await fetchPerformanceDetail(id);

        if (!cancelled) {
          // 카드에서 넘어온 요약 정보가 있다면,
          // 상세 필드(detail)에 요약 필드(prev)를 덮어써서 사용
          setPerformance((prev) =>
            prev
              ? ({ ...detail, ...prev } as PerformanceLike) // 이름/기간/포스터는 카드 값 우선
              : detail,
          );

          // 이미 카드에서 기간을 설정했다면 그대로 유지, 없으면 상세값 사용
          setSelectedDate((prev) => prev || detail.period || "");
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof Error
              ? e.message
              : "공연 정보를 불러오는 중 오류가 발생했습니다.";
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
  }, [id]);

  // 로딩
  if (loading && !performance) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-sm text-neutral-500">
          공연 정보를 불러오는 중입니다…
        </p>
      </main>
    );
  }

  // 에러 / 데이터 없음
  if (error || !performance) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="mb-2 text-center text-sm text-neutral-500">
          {error ?? "해당 공연을 찾을 수 없습니다."}
        </p>
      </main>
    );
  }

  // 가격 정보는 아직 없으므로 일단 "-" 로 표기
  const priceText = "-";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* 상단: 좌(대표 이미지) / 우(정보+예매) */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 좌: 대표 이미지 */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border dark:border-neutral-800">
            <img
              src={performance.posterUrl}
              alt={performance.name}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {/* 우: 정보 + 가격 + 날짜선택 + 예매 */}
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {performance.name}
          </h1>

          <div className="mt-4 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
            <p>
              <span className="inline-block w-16 text-neutral-500">기간</span>
              {performance.period}
            </p>
            <p>
              <span className="inline-block w-16 text-neutral-500">지역</span>
              {performance.area || "-"}
            </p>
            <p>
              <span className="inline-block w-16 text-neutral-500">장르</span>
              {performance.genre || "-"}
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
              {/* 아직 일자별 정보는 없어서, 기간 문자열 하나만 선택값으로 사용 */}
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value={performance.period || ""}>
                  {performance.period || "날짜 정보 없음"}
                </option>
              </select>

              <button
                type="button"
                className="whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
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
            Q&amp;A(38)
          </a>
        </nav>

        {/* 공연정보 섹션 – 지금은 기본 문구 + 포스터만 사용 */}
        <div id="info" className="scroll-mt-20 pt-6">
          <h2 className="mb-3 text-lg font-semibold">공연정보</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            출연진: 정보가 등록되지 않았습니다.
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            관람연령: 정보가 등록되지 않았습니다.
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            안내: 공연 안내가 등록되지 않았습니다.
          </p>

          <div className="mt-4">
            <p className="mb-2 text-sm text-neutral-500">공연 이미지 1</p>
            <div className="overflow-hidden rounded-lg border dark:border-neutral-800">
              <img
                src={performance.posterUrl}
                alt={performance.name}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div id="refund" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">환불정책</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            예매 후 7일 이내 전액 환불(공연 3일 전까지만 가능) 등 정책을 표
            시합니다. (실제 정책은 추후 API 또는 CMS와 연동하여 교체 예정)
          </p>
        </div>

        <div id="reviews" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">관람후기</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            관람객 후기 리스트/평점을 노출합니다. (추후 API 연동 예정)
          </p>
        </div>

        <div id="wish" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">기대평</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            기대평/댓글 UI를 배치합니다. (추후 연동 예정)
          </p>
        </div>

        <div id="qna" className="scroll-mt-20 pt-10">
          <h2 className="mb-3 text-lg font-semibold">Q&amp;A</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            예매/관람 관련 Q&amp;A를 표시합니다. (추후 연동 예정)
          </p>
        </div>
      </section>
    </main>
  );
}
