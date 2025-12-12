// src/api/performances.ts

import http from "../app/http";
import type {
  PerformanceDto,
  PerformanceDetailDto,
} from "../types/api/performance";
import type {
  PerformanceSummaryView,
  PerformanceDetailView,
} from "../types/performanceView";
import {
  toPerformanceSummaryView,
  toPerformanceDetailView,
} from "../utils/normalizePerformances";

// UI에서 사용할 공식 타입
export type PerformanceSummary = PerformanceSummaryView;
export type PerformanceDetail = PerformanceDetailView;

// 공통 응답 형태: { message, data: PerformanceDto[] }
type PerformanceListResponse = {
  message?: string;
  data?: PerformanceDto[];
};

// 상세 응답 형태: { message, data: PerformanceDetailDto }
type PerformanceDetailResponse = {
  message?: string;
  data?: PerformanceDetailDto;
};

/**
 * ✅ 공통: 공연 목록 조회
 * - Search 페이지, 리스트 페이지 등에서 사용
 */
export async function fetchPerformanceList(params?: {
  page?: number;
  size?: number;
  keyword?: string;
  region?: string;
  genre?: string;
}): Promise<PerformanceSummary[]> {
  const { data } = await http.get<PerformanceListResponse>("/performances", {
    params,
  });

  const list = data.data ?? [];
  return list.map(toPerformanceSummaryView);
}

/**
 * ✅ 공통: 랭킹 조회
 * - genre 가 있으면 장르별 랭킹
 * - 없으면 메인 랭킹(핫이슈)
 */
export async function fetchRanking(params?: {
  country?: string;
  genre?: string;
}): Promise<PerformanceSummary[]> {
  // country는 아직 API에서 사용하지 않으므로 무시

  // 장르별 랭킹
  if (params?.genre) {
    const { data } = await http.get<PerformanceListResponse>(
      "/performances/main/by-genre",
      { params: { genre: params.genre } },
    );
    const list = data.data ?? [];
    return list.map(toPerformanceSummaryView);
  }

  // 전체 랭킹 (메인 핫이슈용)
  const { data } = await http.get<PerformanceListResponse>(
    "/performances/main/ranked",
  );
  const list = data.data ?? [];
  return list.map(toPerformanceSummaryView);
}

/**
 * ✅ 공통: 공연 상세 조회
 * - Concert 페이지, usePerformance 훅에서 사용
 */
export async function fetchPerformance(
  mt20id: string,
): Promise<PerformanceDetail> {
  const { data } = await http.get<PerformanceDetailResponse>(
    `/performances/${mt20id}`,
  );

  if (!data.data) {
    throw new Error("공연 상세 정보를 찾을 수 없습니다.");
  }

  // 현재 상세 응답에는 리스트용 필드가 부족해서, 최소 정보만 채워서 넘겨둠
  const dummyListDto: PerformanceDto = {
    mt20id: data.data.mt20id,
    prfnm: "",
    prfpdfrom: "",
    prfpdto: "",
    prfcast: null,
    poster: null,
    genrenm: "",
    sidonm: null,
    gugunnm: null,
    rnum: 0,
  };

  return toPerformanceDetailView(dummyListDto, data.data);
}

/* ===========================
 *  아래부터는 "기존 코드 호환용 래퍼"
 *  (이미 여러 곳에서 쓰고 있는 함수 이름 그대로 유지)
 * ========================= */

/** 기존 Search.tsx 에서 쓰는 이름 */
export async function fetchPerformances(): Promise<PerformanceSummary[]> {
  return fetchPerformanceList();
}

/** 기존 HotIssueSection 에서 쓰는 이름 */
export async function fetchRankedPerformances(): Promise<PerformanceSummary[]> {
  return fetchRanking();
}

/** 기존 RankingSection 에서 쓰는 이름 */
export async function fetchPerformancesByGenre(
  genre: string,
): Promise<PerformanceSummary[]> {
  return fetchRanking({ genre });
}

/** 기존 Concert.tsx 에서 쓰는 이름 */
export const fetchPerformanceDetail = fetchPerformance;
