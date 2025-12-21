import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPerformanceDetail, type PerformanceDetail } from "../api/performances";

type TabKey = "info" | "discount" | "review" | "expect" | "qna";

type ViewModel = {
  id: string;
  title: string;
  period: string | null;
  area: string | null;
  genre: string | null;
  venue: string | null;
  posterUrl: string | null;
};

function toViewModel(detail: PerformanceDetail, fallbackId: string): ViewModel {
  const id = String(detail?.id ?? fallbackId);
  const title = String(detail?.name ?? "공연명");

  const area = typeof detail?.area === "string" ? detail.area : null;
  const genre = typeof detail?.genre === "string" ? detail.genre : null;
  const venue = typeof detail?.venue === "string" ? detail.venue : null;

  const periodFromApi =
    typeof detail?.period === "string" && detail.period.trim() ? detail.period.trim() : null;

  const start = typeof detail?.startDate === "string" ? detail.startDate : null;
  const end = typeof detail?.endDate === "string" ? detail.endDate : null;

  const period = periodFromApi ?? (start && end ? `${start} ~ ${end}` : start ? start : null);

  const posterUrl =
    typeof detail?.posterUrl === "string" && detail.posterUrl.trim()
      ? detail.posterUrl.trim()
      : null;

  return {
    id,
    title,
    period,
    area,
    genre,
    venue,
    posterUrl,
  };
}

export default function Concert() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const performanceId = useMemo(() => String(id ?? "").trim(), [id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ViewModel | null>(null);

  const [tab, setTab] = useState<TabKey>("info");

  useEffect(() => {
    if (!performanceId) {
      setError("공연 ID가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await fetchPerformanceDetail(performanceId);
        const vm = toViewModel(raw, performanceId);

        if (!ignore) setDetail(vm);
      } catch (e) {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "공연 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [performanceId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-neutral-500">불러오는 중입니다.</p>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-red-600">{error ?? "공연 정보를 찾을 수 없습니다."}</p>
      </main>
    );
  }

  const dateOptionLabel = detail.period ?? "날짜 정보가 없습니다.";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* 상단: 포스터 + 기본 정보 */}
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[360px_1fr]">
        {/* 포스터 */}
        <div className="w-full">
          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="aspect-[3/4] w-full bg-neutral-100">
              {detail.posterUrl ? (
                <img src={detail.posterUrl} alt={detail.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm text-neutral-500">포스터가 없습니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 정보 */}
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">{detail.title}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {detail.genre ? (
              <span className="rounded-full border px-3 py-1 text-xs text-neutral-700">{detail.genre}</span>
            ) : null}
          </div>

          {/* 표 형태 정보 */}
          <div className="mt-6 w-full max-w-2xl rounded-2xl border bg-white p-5">
            <div className="grid grid-cols-[64px_1fr] gap-y-2 text-sm">
              <div className="text-neutral-500">기간</div>
              <div className="text-neutral-900">{detail.period ?? "-"}</div>

              <div className="text-neutral-500">지역</div>
              <div className="text-neutral-900">{detail.area ?? "-"}</div>

              <div className="text-neutral-500">장르</div>
              <div className="text-neutral-900">{detail.genre ?? "-"}</div>

              <div className="text-neutral-500">가격</div>
              <div className="text-neutral-900">-</div>
            </div>

            {/* 날짜 선택 + 예매하기 */}
            <div className="mt-5">
              <div className="mb-2 text-sm font-semibold text-neutral-900">날짜 선택</div>

              <div className="flex w-full max-w-2xl gap-3">
                <select
                  className="h-10 w-full rounded-lg border bg-white px-3 text-sm text-neutral-900"
                  value={dateOptionLabel}
                  onChange={() => {
                    // 현재는 단일 옵션(기간 표시)만 유지합니다.
                  }}
                >
                  <option value={dateOptionLabel}>{dateOptionLabel}</option>
                </select>

                {/* ✅ 여기서 실제로 reserve 페이지로 이동 */}
                <button
                  type="button"
                  className="h-10 shrink-0 rounded-lg bg-black px-5 text-sm font-semibold text-white"
                  onClick={() => nav(`/reserve/${detail.id}`)}
                >
                  예매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 탭 */}
      <section className="mt-10">
        <div className="border-b">
          <div className="flex flex-wrap gap-6 text-sm">
            <button
              type="button"
              className={`py-3 ${
                tab === "info" ? "border-b-2 border-black font-semibold text-black" : "text-neutral-600"
              }`}
              onClick={() => setTab("info")}
            >
              공연정보
            </button>

            <button
              type="button"
              className={`py-3 ${
                tab === "discount" ? "border-b-2 border-black font-semibold text-black" : "text-neutral-600"
              }`}
              onClick={() => setTab("discount")}
            >
              할인정보
            </button>

            <button
              type="button"
              className={`py-3 ${
                tab === "review" ? "border-b-2 border-black font-semibold text-black" : "text-neutral-600"
              }`}
              onClick={() => setTab("review")}
            >
              관람후기(999+)
            </button>

            <button
              type="button"
              className={`py-3 ${
                tab === "expect" ? "border-b-2 border-black font-semibold text-black" : "text-neutral-600"
              }`}
              onClick={() => setTab("expect")}
            >
              기대평(999+)
            </button>

            <button
              type="button"
              className={`py-3 ${
                tab === "qna" ? "border-b-2 border-black font-semibold text-black" : "text-neutral-600"
              }`}
              onClick={() => setTab("qna")}
            >
              Q&amp;A(38)
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="mt-8">
          {tab === "info" ? (
            <div>
              <h2 className="text-base font-extrabold text-neutral-900">공연정보</h2>

              <div className="mt-4 space-y-2 text-sm text-neutral-800">
                <p>
                  <span className="font-semibold">출연진</span>: 정보가 등록되지 않았습니다.
                </p>
                <p>
                  <span className="font-semibold">관람연령</span>: 정보가 등록되지 않았습니다.
                </p>
                <p>
                  <span className="font-semibold">안내</span>: 공연 안내가 등록되지 않았습니다.
                </p>
              </div>

              {/* ✅ 요청대로 하단의 큰 이미지(포스터와 다른 상세 이미지)는 렌더링하지 않습니다. */}
            </div>
          ) : (
            <div className="text-sm text-neutral-600">아직 준비 중입니다.</div>
          )}
        </div>
      </section>
    </main>
  );
}
