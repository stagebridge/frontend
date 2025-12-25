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

  // ✅ 상세(소개) 이미지
  images?: string[];

  // ✅ 상세 텍스트 정보(매칭 대상)
  cast?: string;       // prfcast
  runtime?: string;    // prfruntime
  age?: string;        // prfage
  price?: string;      // pcseguidance
  guideTime?: string;  // dtguidance
  crew?: string;       // prfcrew
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

function extractAreaFromName(name: string): string | undefined {
  const m = name.match(/\[([^\]]+)\]/);
  if (!m) return undefined;
  const inside = m[1].trim();
  if (!inside) return undefined;

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

  if (typeof area !== "string" || area.trim().length === 0) {
    area = extractAreaFromName(name);
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

export async function fetchPerformances(): Promise<PerformanceSummary[]> {
  const list = await getFirstList([
    { url: "/performances" },
    { url: "/performances/main" },
    { url: "/performances/all" },
  ]);

  return list.map(normalizeSummary);
}

export async function fetchRankedPerformances(): Promise<PerformanceSummary[]> {
  const list = await getFirstList([{ url: "/performances/main" }, { url: "/performances" }]);
  return list.map(normalizeSummary);
}

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

export async function fetchPerformanceDetail(
  id: string
): Promise<PerformanceDetail> {
  const res = await http.get<ApiOneResponse<any>>(
    `/performances/${encodeURIComponent(id)}`
  );

  // 백엔드 응답이 { message, data } 형태이므로 data만 꺼냅니다.
  const raw = unwrapOne<any>(res.data);
  const summary = normalizeSummary(raw);

  const venue = raw?.venue ?? raw?.fcltynm ?? raw?.place ?? undefined;

  const startDate =
    raw?.startDate ?? raw?.startDt ?? raw?.prfpdfrom ?? raw?.openDt ?? undefined;
  const endDate =
    raw?.endDate ?? raw?.endDt ?? raw?.prfpdto ?? raw?.closeDt ?? undefined;

  // ✅ 소개 이미지(styurls) 매핑
  const imagesRaw =
    Array.isArray(raw?.images)
      ? raw.images
      : Array.isArray(raw?.detailImages)
        ? raw.detailImages
        : Array.isArray(raw?.styurls)
          ? raw.styurls
          : Array.isArray(raw?.styUrls)
            ? raw.styUrls
            : typeof raw?.styurls === "string"
              ? raw.styurls.split(/\s*,\s*/).filter(Boolean)
              : typeof raw?.styUrls === "string"
                ? raw.styUrls.split(/\s*,\s*/).filter(Boolean)
                : typeof raw?.styurl === "string"
                  ? [raw.styurl]
                  : typeof raw?.styUrl === "string"
                    ? [raw.styUrl]
                    : undefined;

  const images = Array.isArray(imagesRaw)
    ? imagesRaw
        .filter((v: any) => typeof v === "string")
        .map((v: string) => v.trim())
        .filter(Boolean)
    : undefined;

  // ✅ 텍스트 필드 매핑 (Swagger 예시 기준)
  const cast = raw?.prfcast ?? raw?.cast ?? undefined;
  const runtime = raw?.prfruntime ?? raw?.runtime ?? undefined;
  const age = raw?.prfage ?? raw?.age ?? undefined;
  const price = raw?.pcseguidance ?? raw?.price ?? undefined;
  const guideTime = raw?.dtguidance ?? raw?.guideTime ?? undefined;
  const crew = raw?.prfcrew ?? raw?.crew ?? undefined;

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

    cast: typeof cast === "string" ? cast : undefined,
    runtime: typeof runtime === "string" ? runtime : undefined,
    age: typeof age === "string" ? age : undefined,
    price: typeof price === "string" ? price : undefined,
    guideTime: typeof guideTime === "string" ? guideTime : undefined,
    crew: typeof crew === "string" ? crew : undefined,
  };
}
