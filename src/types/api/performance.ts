// 공연 상세 정보 (performance_details 테이블)
export interface PerformanceDetailDto {
  mt20id: string;          // 공연 ID (KOPIS 기본키)
  fcltynm: string;         // 공연장 이름
  mt10id: string | null;   // 공연장 ID
  prfstate: string;        // 공연 상태 (공연중/공연완료 등)
  prfcrew: string | null;  // 출연진
  prfruntime: string | null; // 러닝타임
  prfage: string | null;     // 관람 연령
  pcseguidance: string | null; // 가격 안내
  dtguidance: string | null;   // 시간/회차 안내
  styurls: unknown;        // jsonb → 우선 any/unknown으로 두고 나중에 구조 알면 수정
  ticketingAgencies: unknown; // jsonb
}

// 공연 리스트 정보 (performances 테이블)
export interface PerformanceDto {
  mt20id: string;        // 공연 ID
  prfnm: string;         // 공연 이름
  prfpdfrom: string;     // 공연 시작일 (date → 문자열로 온다고 가정)
  prfpdto: string;       // 공연 종료일
  prfcast: string | null;// 출연진 (요약)
  poster: string | null; // 포스터 이미지 URL
  genrenm: string;       // 장르명
  sidonm: string | null; // 시/도
  gugunnm: string | null;// 구/군
  rnum: number;          // 순번(랭킹/페이지용)
}

