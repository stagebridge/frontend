// src/services/performanceApi.ts
import type { PerformanceSummary } from "../types/performance";

/**
 * V2 홈의 "핫이슈"는 기존 백엔드에 명시적인 엔드포인트가 없을 수 있으므로,
 * 우선은 "공연 목록"을 가져와서 프론트에서 상위 N개를 핫이슈로 사용합니다.
 *
 * ✅ TODO:
 * - 백엔드에 hot-issues 전용 API가 생기면 이 함수만 교체하면 됩니다.
 */
export async function getHotIssues(): Promise<PerformanceSummary[]> {
  // Vite 환경 변수 우선, 없으면 기본값 사용
  const base =
    import.meta.env.VITE_API_BASE ??
    "http://localhost:3000/api";

  /**
   * ⚠️ 이 URL은 프로젝트마다 다를 수 있습니다.
   * - /performances
   * - /performance
   * - /concerts
   * - /performances/list
   *
   * 현재 단계에서는 "빌드/런타임 에러 제거"가 목적이므로,
   * 아래 엔드포인트가 404라면, 브라우저 네트워크 탭에서
   * 실제로 성공하는 목록 API 경로를 확인한 뒤 수정하십시오.
   */
  const url = `${base}/performances`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`getHotIssues failed: ${res.status}`);
  }

  const data = await res.json();

  /**
   * 백엔드 응답 형태가 다음 중 무엇이든 대응하도록 방어적으로 처리합니다.
   * - 배열: PerformanceSummary[]
   * - 객체: { items: PerformanceSummary[] }
   * - 객체: { data: PerformanceSummary[] }
   */
  const items: PerformanceSummary[] =
    Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);

  // 상위 12개만 핫이슈로 노출(원하는 개수로 조절 가능)
  return items.slice(0, 12);
}
