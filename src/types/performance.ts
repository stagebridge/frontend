// src/types/performance.ts

/**
 * StageBridge에서 사용하는 공연 타입의 "단일 진실 소스"는 src/api/performances.ts 입니다.
 * HomeV2 등 UI 컴포넌트에서는 types 경로로 import 하는 경우가 많아,
 * 여기서 타입을 재-export하여 경로 충돌을 방지합니다.
 */

export type { PerformanceSummary, PerformanceDetail } from "../api/performances";
