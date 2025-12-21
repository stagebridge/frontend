// src/utils/region.ts

import { REGION_GROUP_BY_SIDO, type RegionGroup } from "../constants/ranking";

/**
 * sidonm 토큰 정규화
 * - 예: "서울특별시" -> "서울"
 * - 예: "제주특별자치도" -> "제주"
 * - 예: "충청북도" -> "충북"
 */
export function normalizeSidoToken(token: string): string {
  const t = token.trim();

  // 특별시/광역시
  if (t.includes("서울")) return "서울";
  if (t.includes("인천")) return "인천";
  if (t.includes("대전")) return "대전";
  if (t.includes("대구")) return "대구";
  if (t.includes("부산")) return "부산";
  if (t.includes("울산")) return "울산";
  if (t.includes("광주")) return "광주";
  if (t.includes("세종")) return "세종";

  // 도
  if (t.includes("경기도")) return "경기";
  if (t.includes("강원")) return "강원";
  if (t.includes("충청북")) return "충북";
  if (t.includes("충청남")) return "충남";
  if (t.includes("전라북")) return "전북";
  if (t.includes("전라남")) return "전남";
  if (t.includes("경상북")) return "경북";
  if (t.includes("경상남")) return "경남";
  if (t.includes("제주")) return "제주";

  /**
   * ✅ 시/군/구 단위로 area가 오는 케이스 보정
   * - 최소 요구사항: 구미, 경산, 대구 -> 영남권
   * - 대구는 이미 위에서 처리되며, 구미/경산은 경북으로 귀속
   */
  if (/(구미|경산|포항|경주|김천|안동|영주|영천|상주|문경|울진|울릉)/.test(t)) return "경북";
  if (/(창원|진주|통영|사천|김해|밀양|거제|양산)/.test(t)) return "경남";

  if (/(수원|성남|용인|고양|부천|화성|안산|안양|평택|남양주|의정부)/.test(t)) return "경기";
  if (/(청주|충주|제천)/.test(t)) return "충북";
  if (/(천안|아산|서산|논산|공주)/.test(t)) return "충남";

  // 이미 축약형으로 오는 케이스(서울/경기/충북 등)
  return t;
}

/**
 * 공연의 area(= sidonm 기반)에서 권역을 얻는다.
 */
export function getRegionGroupFromArea(area?: string | null): RegionGroup | null {
  if (!area) return null;
  const key = normalizeSidoToken(area);
  return REGION_GROUP_BY_SIDO[key] ?? null;
}
