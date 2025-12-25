import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPerformanceDetail } from "../api/performances";
import BoardSection, { type BoardKind } from "../components/concert-detail/BoardSection";
import DetailImagesSection from "../components/concert-detail/DetailImagesSection";

type NormalizedDetail = {
  id: string;
  title: string;
  posterUrl: string;

  // ✅ 상세 이미지 배열
  detailImages: string[];

  regionLabel?: string;
  genreLabel?: string;
  periodLabel?: string;

  cast?: string;
  runtime?: string;
  age?: string;
  price?: string;
  guideTime?: string;
  crew?: string;
};

function normalizeDetail(raw: any): NormalizedDetail {
  const id = String(raw?.id ?? raw?.mt20id ?? raw?.performanceId ?? raw?.perfId ?? "");
  const title = String(raw?.name ?? raw?.prfnm ?? raw?.title ?? "공연명");

  const posterUrl =
    String(raw?.posterUrl ?? raw?.poster ?? raw?.posterurl ?? "").trim() ||
    "/images/fallback-poster.png";

  const start = raw?.startDate ?? raw?.prfpdfrom ?? raw?.startDt ?? raw?.openDt;
  const end = raw?.endDate ?? raw?.prfpdto ?? raw?.endDt ?? raw?.closeDt;
  const periodLabel = start && end ? `${start} ~ ${end}` : start ? String(start) : undefined;

  const regionLabel = raw?.area ?? raw?.areaNm ?? raw?.fcltynm ?? raw?.sidoNm ?? undefined;
  const genreLabel = raw?.genre ?? raw?.genrenm ?? undefined;

  // ✅ API에서 images로 내려오게 수정했지만, 안전하게 styurls도 fallback
  const imagesRaw =
    Array.isArray(raw?.images)
      ? raw.images
      : Array.isArray(raw?.styurls)
        ? raw.styurls
        : Array.isArray(raw?.styUrls)
          ? raw.styUrls
          : typeof raw?.styurls === "string"
            ? raw.styurls.split(/\s*,\s*/).filter(Boolean)
            : typeof raw?.styUrls === "string"
              ? raw.styUrls.split(/\s*,\s*/).filter(Boolean)
              : [];

  const detailImages = (imagesRaw as unknown[])
    .filter((v) => typeof v === "string")
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0)
    // 포스터와 동일 URL이면 중복 제거
    .filter((v) => v !== posterUrl);

  return {
    id,
    title,
    posterUrl,
    detailImages,
    regionLabel,
    genreLabel,
    periodLabel,
    cast: raw?.prfcast ?? raw?.cast ?? undefined,
    runtime: raw?.prfruntime ?? raw?.runtime ?? undefined,
    age: raw?.prfage ?? raw?.age ?? undefined,
    price: raw?.pcseguidance ?? raw?.price ?? undefined,
    guideTime: raw?.dtguidance ?? raw?.guideTime ?? undefined,
    crew: raw?.prfcrew ?? raw?.crew ?? undefined,
  };
}

export default function ConcertDetail() {
  const { id } = useParams();
  const performanceId = (id ?? "").trim();

  const [raw, setRaw] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const infoRef = useRef<HTMLElement | null>(null);
  const reviewsRef = useRef<HTMLElement | null>(null);
  const expectationsRef = useRef<HTMLElement | null>(null);
  const qaRef = useRef<HTMLElement | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    const el = ref.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!performanceId) return;

    setLoading(true);
    setErrorMsg(null);

    fetchPerformanceDetail(performanceId)
      .then((res) => setRaw(res))
      .catch((e) => setErrorMsg(e?.message ?? "상세 정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [performanceId]);

  const detail = useMemo(() => (raw ? normalizeDetail(raw) : null), [raw]);

  if (!performanceId) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-700">
          잘못된 접근입니다. 공연 ID가 없습니다.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-700">불러오는 중입니다.</div>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 text-sm text-red-600">{errorMsg}</div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-700">
          공연 정보를 찾을 수 없습니다.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-gray-100">
          <img src={detail.posterUrl} alt={detail.title} className="h-full w-full object-cover" />
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">{detail.title}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            {detail.genreLabel ? (
              <span className="rounded-full border px-3 py-1 text-xs text-gray-700">{detail.genreLabel}</span>
            ) : null}
            {detail.regionLabel ? (
              <span className="rounded-full border px-3 py-1 text-xs text-gray-700">{detail.regionLabel}</span>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border p-4 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-900">기간: </span>
              {detail.periodLabel ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">출연진: </span>
              {detail.cast ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">상영시간: </span>
              {detail.runtime ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">관람연령: </span>
              {detail.age ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">가격: </span>
              {detail.price ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">상영시간대: </span>
              {detail.guideTime ?? "정보가 등록되지 않았습니다."}
            </p>
            <p className="mt-2">
              <span className="font-medium text-gray-900">제작진: </span>
              {detail.crew ?? "정보가 등록되지 않았습니다."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => scrollTo(infoRef)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              공연정보
            </button>
            <button
              type="button"
              onClick={() => scrollTo(reviewsRef)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              관람후기
            </button>
            <button
              type="button"
              onClick={() => scrollTo(expectationsRef)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              기대평
            </button>
            <button
              type="button"
              onClick={() => scrollTo(qaRef)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              Q&amp;A
            </button>
          </div>
        </div>
      </div>

      {/* 공연정보 */}
      <section ref={infoRef} id="info" className="mt-10 space-y-4">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">공연정보</h2>
        </div>

        {/* ✅ 기존의 “표시할 수 없습니다” 하드코딩 박스를 제거하고, 실제 이미지 렌더링 */}
        <DetailImagesSection images={detail.detailImages ?? []} />
      </section>

      {/* 관람후기 */}
      <section ref={reviewsRef} id="reviews" className="mt-10">
        <BoardSection performanceId={detail.id} kind={"reviews" satisfies BoardKind} title="관람후기" />
      </section>

      {/* 기대평 */}
      <section ref={expectationsRef} id="expectations" className="mt-10">
        <BoardSection performanceId={detail.id} kind={"expectations" satisfies BoardKind} title="기대평" />
      </section>

      {/* Q&A */}
      <section ref={qaRef} id="qa" className="mt-10">
        <BoardSection performanceId={detail.id} kind={"qa" satisfies BoardKind} title="Q&A" />
      </section>
    </main>
  );
}
