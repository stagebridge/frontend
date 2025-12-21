// src/utils/normalizePerformances.ts

import type { PerformanceDto, PerformanceDetailDto } from "../types/api/performance";
import type { PerformanceSummaryView, PerformanceDetailView } from "../types/performanceView";

// 리스트(요약)용 노멀라이즈
export function toPerformanceSummaryView(dto: PerformanceDto): PerformanceSummaryView {
  const period = `${dto.prfpdfrom} ~ ${dto.prfpdto}`;

  const areaParts = [dto.sidonm, dto.gugunnm].filter(Boolean);
  const area = areaParts.join(" ");

  return {
    id: dto.mt20id,
    name: dto.prfnm,
    period,
    posterUrl: dto.poster ?? "",
    genre: dto.genrenm,
    area,
  };
}

/** ✅ 어떤 형태로 오든 image urls를 string[]로 만드는 파서 */
function parseImageUrls(value: unknown): string[] {
  if (!value) return [];

  // 이미 배열로 오는 경우
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // JSON 배열 문자열 또는 단일 URL 문자열로 오는 경우
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];

    // JSON 배열 문자열
    if (raw.startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((v): v is string => typeof v === "string")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch {
        // ignore
      }
    }

    // 단일 URL
    if (raw.startsWith("http")) return [raw];
  }

  return [];
}

function uniqueAndWithoutPoster(urls: string[], posterUrl: string) {
  const poster = (posterUrl ?? "").trim();
  return Array.from(
    new Set(
      urls
        .map((u) => u.trim())
        .filter(Boolean)
        .filter((u) => (poster ? u !== poster : true)),
    ),
  );
}

// 상세용 노멀라이즈
export function toPerformanceDetailView(
  listDto: PerformanceDto,
  detailDto: PerformanceDetailDto,
): PerformanceDetailView {
  const summary = toPerformanceSummaryView(listDto);

  // ✅ 상세 dto에 poster가 있을 수도 있어서 보강(없으면 summary.posterUrl 사용)
  const posterFromDetail =
    typeof (detailDto as any)?.poster === "string" ? String((detailDto as any).poster).trim() : "";
  const posterUrl = posterFromDetail || summary.posterUrl;

  // ✅ styurls가 jsonb라서 “배열/문자열” 모두 대응
  const styleCandidates = parseImageUrls(detailDto.styurls);
  const styleImageUrls = uniqueAndWithoutPoster(styleCandidates, posterUrl);

  const ticketingAgencies = Array.isArray(detailDto.ticketingAgencies)
    ? detailDto.ticketingAgencies
    : [];

  return {
    ...summary,
    posterUrl, // ✅ 보강된 posterUrl로 덮어쓰기

    facilityName: detailDto.fcltynm,
    state: detailDto.prfstate,
    runtime: detailDto.prfruntime ?? "",
    ageLimit: detailDto.prfage ?? "",
    priceGuide: detailDto.pcseguidance ?? "",
    dateGuide: detailDto.dtguidance ?? "",
    cast: (listDto.prfcast ?? detailDto.prfcrew ?? "") || "",
    styleImageUrls,
    ticketingAgencies,
  };
}
