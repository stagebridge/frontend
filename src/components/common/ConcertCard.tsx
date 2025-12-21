import { Link } from "react-router-dom";

/**
 * ✅ 프로젝트마다 PerformanceSummary 타입/필드명이 달라서
 *    외부 타입 import를 제거하고, 필요한 최소 필드만 로컬로 정의합니다.
 */
type ConcertItem = {
  id?: string | number;
  performanceId?: string | number;
  perfId?: string | number;
  mt20id?: string | number;

  title?: string;
  prfnm?: string;
  name?: string;

  posterUrl?: string;
  poster?: string;
  styurls?: string;
  imageUrl?: string;

  area?: string;
  areaNm?: string;
  sidoNm?: string;

  // ✅ 기간/날짜 관련 (프로젝트/응답마다 다름)
  period?: string; // 예: "2025-07-24 ~ 2025-11-30"
  prfpd?: string;

  startDate?: string;
  startDt?: string;
  prfpdfrom?: string;
  openDt?: string;

  endDate?: string;
  endDt?: string;
  prfpdto?: string;
  closeDt?: string;
};

type ConcertCardByItemProps = {
  item: ConcertItem;
  href?: string; // 없으면 내부에서 item 기반으로 생성
};

type ConcertCardByFieldsProps = {
  href: string;
  title: string;
  posterUrl: string;
  regionLabel?: string; // ✅ optional
  dateLabel?: string; // ✅ optional
};

type ConcertCardProps = ConcertCardByItemProps | ConcertCardByFieldsProps;

function isByItemProps(props: ConcertCardProps): props is ConcertCardByItemProps {
  return (props as ConcertCardByItemProps).item !== undefined;
}

/** ✅ "YYYY-MM-DD ~ YYYY-MM-DD" 같은 문자열에서 날짜만 깔끔히 뽑기 */
function normalizeDateLabel(raw?: string): string | undefined {
  const v = (raw ?? "").trim();
  if (!v) return undefined;

  // 이미 "~"를 포함한 기간 문자열이면 그대로 사용(메인처럼)
  if (v.includes("~")) return v;

  // 단일 날짜면 그대로
  return v;
}

/** ✅ start/end가 있으면 "start ~ end" 형태로 생성 */
function buildRange(start?: string, end?: string): string | undefined {
  const s = (start ?? "").trim();
  const e = (end ?? "").trim();

  if (s && e) return `${s} ~ ${e}`;
  if (s) return s;
  return undefined;
}

export default function ConcertCard(props: ConcertCardProps) {
  // ✅ item 기반(기존 코드 호환)
  if (isByItemProps(props)) {
    const item = props.item;

    const id = item.id ?? item.performanceId ?? item.perfId ?? item.mt20id ?? "";
    const href = props.href ?? `/concerts/${id}`;

    const title = item.title ?? item.prfnm ?? item.name ?? "제목 없음";
    const posterUrl =
      item.posterUrl ??
      item.poster ??
      item.styurls ??
      item.imageUrl ??
      "/images/fallback-poster.png";

    const regionLabel = item.area ?? item.areaNm ?? item.sidoNm ?? undefined;

    // ✅ 날짜 우선순위:
    // 1) period/prfpd 같은 "기간 문자열"이 있으면 그걸 우선 사용
    // 2) 없으면 start/end 조합으로 생성
    const directPeriod = normalizeDateLabel(item.period ?? item.prfpd);

    const startDate =
      item.startDate ?? item.startDt ?? item.prfpdfrom ?? item.openDt ?? undefined;

    const endDate =
      item.endDate ?? item.endDt ?? item.prfpdto ?? item.closeDt ?? undefined;

    const dateLabel = directPeriod ?? buildRange(startDate, endDate);

    return (
      <Link
        to={href}
        className="block overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-sm"
      >
        <div className="w-full overflow-hidden bg-gray-100">
          <img
            src={posterUrl}
            alt={title}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-3">
          <p className="line-clamp-1 text-sm font-semibold text-gray-900">{title}</p>

          {regionLabel ? (
            <p className="mt-1 line-clamp-1 text-xs text-gray-600">{regionLabel}</p>
          ) : null}

          {/* ✅ 날짜 표시(요청사항) */}
          {dateLabel ? (
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">{dateLabel}</p>
          ) : null}
        </div>
      </Link>
    );
  }

  // ✅ 필드 기반(새 코드)
  const { href, title, posterUrl, regionLabel, dateLabel } = props;

  return (
    <Link
      to={href}
      className="block overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-sm"
    >
      <div className="w-full overflow-hidden bg-gray-100">
        <img
          src={posterUrl}
          alt={title}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-semibold text-gray-900">{title}</p>

        {regionLabel ? (
          <p className="mt-1 line-clamp-1 text-xs text-gray-600">{regionLabel}</p>
        ) : null}

        {dateLabel ? (
          <p className="mt-1 line-clamp-1 text-xs text-gray-500">{dateLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}
