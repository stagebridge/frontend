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

// 상세용 노멀라이즈
export function toPerformanceDetailView(
  listDto: PerformanceDto,
  detailDto: PerformanceDetailDto
): PerformanceDetailView {
  const summary = toPerformanceSummaryView(listDto);

  // styurls, ticketingAgencies는 jsonb 구조를 알기 전까지 안전하게 파싱
  const styleImageUrls = Array.isArray(detailDto.styurls)
    ? detailDto.styurls.filter((x): x is string => typeof x === "string")
    : [];

  const ticketingAgencies = Array.isArray(detailDto.ticketingAgencies)
    ? detailDto.ticketingAgencies
    : [];

  return {
    ...summary, // id, name, period, posterUrl, genre, area 포함

    facilityName: detailDto.fcltynm,
    state: detailDto.prfstate,
    runtime: detailDto.prfruntime ?? "",
    ageLimit: detailDto.prfage ?? "",
    priceGuide: detailDto.pcseguidance ?? "",
    dateGuide: detailDto.dtguidance ?? "",
    cast: listDto.prfcast ?? detailDto.prfcrew ?? "",
    styleImageUrls,
    ticketingAgencies,
  };
}
