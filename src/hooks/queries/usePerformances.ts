import { useQuery } from "@tanstack/react-query";
import {
  fetchPerformances,
  fetchPerformanceDetail,
  type PerformanceSummary,
  type PerformanceDetail,
} from "../../api/performances";
import { normalizeSidoToken } from "../../utils/region";

type ListParams = {
  page?: number;
  size?: number;
  keyword?: string;
  region?: string;
  genre?: string;
};

function includesSafe(haystack?: string, needle?: string): boolean {
  const h = (haystack ?? "").toLowerCase();
  const n = (needle ?? "").toLowerCase().trim();
  if (!n) return true;
  return h.includes(n);
}

function filterList(items: PerformanceSummary[], params?: ListParams): PerformanceSummary[] {
  if (!params) return items;

  const keyword = params.keyword?.trim();
  const genre = params.genre?.trim();
  const region = params.region?.trim();

  return items.filter((p) => {
    const okKeyword =
      !keyword ||
      includesSafe(p.name, keyword) ||
      includesSafe(p.area, keyword) ||
      includesSafe(p.genre, keyword);

    const okGenre = !genre || includesSafe(p.genre, genre);

    // region은 서버 표기 흔들림을 대비해 normalize 후 비교
    const pRegion = normalizeSidoToken(p.area ?? "");
    const qRegion = normalizeSidoToken(region ?? "");
    const okRegion = !qRegion || (pRegion && pRegion === qRegion);

    return okKeyword && okGenre && okRegion;
  });
}

function paginate(items: PerformanceSummary[], params?: ListParams): PerformanceSummary[] {
  const size = params?.size ?? 20;
  const page = params?.page ?? 1;

  const safeSize = Number.isFinite(size) && size > 0 ? size : 20;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const start = (safePage - 1) * safeSize;
  return items.slice(start, start + safeSize);
}

export function usePerformanceList(params?: ListParams) {
  return useQuery<PerformanceSummary[]>({
    queryKey: ["performances", params],
    queryFn: async () => {
      const all = await fetchPerformances(); // ✅ 단일 소스에서 가져온 뒤 프런트에서 필터링/페이징
      const filtered = filterList(all, params);
      return paginate(filtered, params);
    },
    staleTime: 30_000,
  });
}

export function usePerformance(id?: string) {
  return useQuery<PerformanceDetail>({
    queryKey: ["performance", id],
    queryFn: () => fetchPerformanceDetail(id as string),
    enabled: !!id, // ✅ 기존 코드의 enabled: !id 는 반대로 동작합니다.
    staleTime: 30_000,
  });
}

export function useRanking(params?: { country?: string; genre?: string }) {
  return useQuery<PerformanceSummary[]>({
    queryKey: ["ranking", params],
    queryFn: async () => {
      const all = await fetchPerformances();

      // country가 실제 데이터에 반영되지 않는 경우가 많아, 우선 genre 중심으로 처리
      const genre = params?.genre?.trim();
      if (!genre) return all.slice(0, 50);

      return all.filter((p) => includesSafe(p.genre, genre)).slice(0, 50);
    },
    staleTime: 60_000,
  });
}
