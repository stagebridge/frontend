// 공연 요약 정보 (카드, 리스트용)
export interface PerformanceSummaryView {
  id: string;          // mt20id에서 변환
  name: string;        // prfnm
  period: string;      // "YYYY.MM.DD ~ YYYY.MM.DD" 형태
  posterUrl: string;   // 포스터 이미지
  genre: string;       // genrenm
  area: string;        // "시도 구군" 합친 문자열
}

export interface PerformanceDetailView extends PerformanceSummaryView {
  facilityName: string;    // fcltynm (공연장 이름)
  state: string;           // prfstate (공연 상태)
  runtime: string;         // prfruntime
  ageLimit: string;        // prfage
  priceGuide: string;      // pcseguidance
  dateGuide: string;       // dtguidance
  cast: string;            // prfcast (요약 or 상세)
  // 스타일 이미지, 예매처 등은 jsonb 구조 확인 후 세부 타입 분리
  styleImageUrls: string[];
  ticketingAgencies: unknown[]; // 나중에 구조 알게 되면 TicketingAgencyView로 교체
}
