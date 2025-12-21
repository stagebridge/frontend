// src/constants/ranking.ts

export const GENRES = [
  "뮤지컬",
  "연극",
  "서양음악(클래식)",
  "한국음악(국악)",
  "대중음악",
  "서커스/마술",
  "복합",
] as const;

export type GenreLabel = (typeof GENRES)[number];

export const REGIONS = [
  "수도권",
  "충청권",
  "영남권",
  "호남권",
  "강원권",
  "제주",
] as const;

export type RegionGroup = (typeof REGIONS)[number];

/**
 * ✅ 권역 → 시·도(sidonm) 리스트
 * - 중요: 백엔드/DB의 sidonm 토큰(축약형)과 일치해야 합니다.
 * - 예: "서울특별시"가 아니라 "서울"
 */
export const REGION_SIDO_LIST_BY_GROUP: Record<RegionGroup, readonly string[]> = {
  수도권: ["서울", "경기", "인천"],
  충청권: ["충북", "충남", "대전", "세종"],
  영남권: ["부산", "대구", "울산", "경남", "경북"],
  호남권: ["광주", "전남", "전북"],
  강원권: ["강원"],
  제주: ["제주"],
} as const;

/**
 * 시·도(응답 문자열) → 권역(지역 그룹)
 */
export const REGION_GROUP_BY_SIDO: Record<string, RegionGroup> = {
  서울: "수도권",
  경기: "수도권",
  인천: "수도권",

  충북: "충청권",
  충남: "충청권",
  대전: "충청권",
  세종: "충청권",

  부산: "영남권",
  대구: "영남권",
  울산: "영남권",
  경북: "영남권",
  경남: "영남권",

  광주: "호남권",
  전북: "호남권",
  전남: "호남권",

  강원: "강원권",

  제주: "제주",
};
