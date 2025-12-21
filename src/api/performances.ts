import http from "../app/http";
import axios from "axios";
import { normalizeSidoToken } from "../utils/region";

export type PerformanceSummary = {
  id: string;
  name: string;
  area?: string;
  genre?: string;
  period?: string;
  posterUrl?: string;
};

export type PerformanceDetail = {
  id: string;
  name: string;
  area?: string;
  genre?: string;
  period?: string;
  posterUrl?: string;

  venue?: string;
  startDate?: string;
  endDate?: string;
  images?: string[];
};

type ApiListResponse<T> = T[] | { data: T[] } | { items: T[] };
type ApiOneResponse<T> = T | { data: T };

function unwrapList<T>(payload: ApiListResponse<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as any).data)
  ) {
    return (payload as any).data as T[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "items" in payload &&
    Array.isArray((payload as any).items)
  ) {
    return (payload as any).items as T[];
  }
  return [];
}

function unwrapOne<T>(payload: ApiOneResponse<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as any).data as T;
  }
  return payload as T;
}

/**
 * 공연명에서 지역 토큰 추출 (예: "레드북 [서울 광진]" → "서울")
 */
function extractAreaFromName(name: string): string | undefined {
  const m = name.match(/\[([^\]]+)\]/);
  if (!m) return undefined;
  const inside = m[1].trim();
  if (!inside) return undefined;

  // 첫 토큰을 sido로 간주 (서울/경기/부산 등)
  const firstToken = inside.split(/\s+/)[0]?.trim();
  if (!firstToken) return undefined;

  const normalized = normalizeSidoToken(firstToken);
  return normalized || undefined;
}

function normalizeSummary(raw: any): PerformanceSummary {
  const id = String(raw?.id ?? raw?.perfId ?? raw?.prfid ?? raw?.mt20id ?? "");
  const name = String(raw?.name ?? raw?.title ?? raw?.prfnm ?? "제목 없음");

  let area =
    raw?.area ?? raw?.areaNm ?? raw?.sidoNm ?? raw?.sidonm ?? undefined;
  const genre = raw?.genre ?? raw?.genrenm ?? undefined;

  const start =
    raw?.startDate ?? raw?.startDt ?? raw?.prfpdfrom ?? raw?.openDt ?? undefined;
  const end =
    raw?.endDate ?? raw?.endDt ?? raw?.prfpdto ?? raw?.closeDt ?? undefined;

  const period =
    raw?.period ??
    (start && end ? `${start} ~ ${end}` : start ? `${start}` : undefined);

  const posterUrl =
    raw?.posterUrl ??
    raw?.poster ??
    raw?.styurl ??
    (Array.isArray(raw?.styurls) ? raw.styurls[0] : raw?.styurls) ??
    raw?.imageUrl ??
    undefined;

  // ✅ area가 없으면 name에서 [지역] 파싱으로 보정
  if (typeof area !== "string" || area.trim().length === 0) {
    const derived = extractAreaFromName(name);
    area = derived;
  } else {
    area = normalizeSidoToken(area);
  }

  return {
    id,
    name,
    area: typeof area === "string" ? area : undefined,
    genre: typeof genre === "string" ? genre : undefined,
    period: typeof period === "string" ? period : undefined,
    posterUrl: typeof posterUrl === "string" ? posterUrl : undefined,
  };
}

async function getFirstList(
  paths: Array<{ url: string; params?: Record<string, any> }>
): Promise<any[]> {
  for (const p of paths) {
    try {
      const res = await http.get<ApiListResponse<any>>(
        p.url,
        p.params ? { params: p.params } : undefined
      );
      return unwrapList<any>(res.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 404) continue;
      throw e;
    }
  }
  return [];
}

/** ✅ 전체 목록: 404를 유발하는 ranked 후보는 제거 */
export async function fetchPerformances(): Promise<PerformanceSummary[]> {
  const list = await getFirstList([
    { url: "/performances" },
    { url: "/performances/main" },
    { url: "/performances/all" },
  ]);

  return list.map(normalizeSummary);
}

/** (남겨두되, 랭킹 섹션에서는 사용하지 않도록 권장) */
export async function fetchRankedPerformances(): Promise<PerformanceSummary[]> {
  const list = await getFirstList([
    { url: "/performances/main" },
    { url: "/performances" },
  ]);

  return list.map(normalizeSummary);
}

/** (남겨두되, 랭킹 섹션에서는 사용하지 않도록 권장) */
export async function fetchPerformancesByGenre(
  genre: string
): Promise<PerformanceSummary[]> {
  const list = await getFirstList([
    { url: "/performances/by-genre", params: { genre } },
    { url: "/performances/genre", params: { genre } },
    { url: "/performances/main/by-genre", params: { genre } },
  ]);

  return list.map(normalizeSummary);
}

/** 상세 */
export async function fetchPerformanceDetail(
  id: string
): Promise<PerformanceDetail> {
  const res = await http.get<ApiOneResponse<any>>(
    `/performances/${encodeURIComponent(id)}`
  );
  const raw = unwrapOne<any>(res.data);
  const summary = normalizeSummary(raw);

  const venue = raw?.venue ?? raw?.fcltynm ?? raw?.place ?? undefined;

  const startDate =
    raw?.startDate ?? raw?.startDt ?? raw?.prfpdfrom ?? raw?.openDt ?? undefined;
  const endDate =
    raw?.endDate ?? raw?.endDt ?? raw?.prfpdto ?? raw?.closeDt ?? undefined;

  const images = Array.isArray(raw?.images)
    ? raw.images
    : Array.isArray(raw?.detailImages)
      ? raw.detailImages
      : undefined;

  return {
    id: summary.id,
    name: summary.name,
    area: summary.area,
    genre: summary.genre,
    period: summary.period,
    posterUrl: summary.posterUrl,
    venue: typeof venue === "string" ? venue : undefined,
    startDate: typeof startDate === "string" ? startDate : undefined,
    endDate: typeof endDate === "string" ? endDate : undefined,
    images,
  };
}
