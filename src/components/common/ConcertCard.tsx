// src/components/common/ConcertCard.tsx
import { Link } from "react-router-dom";
import type { PerformanceSummary } from "../../api/performances";

/**
 * 다양한 스키마를 수용하기 위한 느슨한 타입
 * - KOPIS 필드(ex. mt20id, prfnm, prfpdfrom/prfpdto, poster, fcltynm …)
 * - 백엔드 필드(ex. id, title, startDate/endDate, coverUrl, venue …)
 */
type LoosePerformance = PerformanceSummary & {
  mt20id?: string;
  prfnm?: string;
  prfpdfrom?: string;
  prfpdto?: string;
  poster?: string;
  posterUrl?: string;
  fcltynm?: string;
  prfvenue?: string;
  hallName?: string;
  name?: string;
  period?: string;
  imageUrl?: string;
  venue?: string;
};

/** UI 표시용 매핑 함수 (필드명이 달라도 여기서 흡수) */
function toView(p: LoosePerformance) {
  const id =
    (p as any).id ??
    p.mt20id ??
    "";

  const title =
    p.name ??
    p.prfnm ??
    (p as any).title ??
    "공연 제목 미정";

  const cover =
    p.posterUrl ??
    p.poster ??
    p.imageUrl ??
    "/noimage.png";

  const venue =
    (p as any).venue ??
    p.hallName ??
    p.prfvenue ??
    p.fcltynm ??
    "";

  const period =
    p.period ??
    ((p as any).startDate && (p as any).endDate
      ? `${(p as any).startDate} ~ ${(p as any).endDate}`
      : p.prfpdfrom && p.prfpdto
      ? `${p.prfpdfrom} ~ ${p.prfpdto}`
      : "");

  return { id: String(id), title, cover, venue, period };
}

export default function ConcertCard({ item }: { item: LoosePerformance }) {
  if (!item) return <div>공연 정보를 불러올 수 없습니다.</div>;

  const v = toView(item);

  // 상세 페이지에 넘겨줄 요약 정보 (상단 영역에서 바로 사용)
  const summaryForState: PerformanceSummary = {
    id: String(v.id),
    name: item.name ?? v.title,
    period: item.period ?? v.period,
    posterUrl: item.posterUrl ?? v.cover,
    genre: item.genre ?? "",
    area: item.area ?? "",
  };

  return (
    <Link
      to={`/concerts/${v.id}`}
      state={{ performance: summaryForState }} // ⭐ 요약 정보 함께 전달
      className="block rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-md dark:bg-neutral-900 dark:ring-neutral-800"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img
          src={v.cover}
          alt={v.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-3 pb-3 pt-2">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {v.title}
        </h3>
        {v.venue && (
          <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
            {v.venue}
          </p>
        )}
        {v.period && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {v.period}
          </p>
        )}
      </div>
    </Link>
  );
}
