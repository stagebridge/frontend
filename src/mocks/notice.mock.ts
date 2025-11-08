export type Notice = {
  id: number;
  title: string;
  createdAt: string; // YYYY-MM-DD
};

export const NOTICES: Notice[] = [
  { id: 20, title: "2025 공연·전시 할인쿠폰 추가 발급 안내", createdAt: "2025-09-22" },
  { id: 19, title: "2025 공연·전시 할인쿠폰 안내", createdAt: "2025-09-22" },
  { id: 18, title: "민화책 소비쿠폰 사용 관련 안내", createdAt: "2025-09-22" },
  { id: 17, title: "페이지 사용 주의 안내", createdAt: "2025-09-22" },
  { id: 16, title: "타임세일 NOW!", createdAt: "2025-09-22" },
  { id: 15, title: "페이지에 놀러오세요!", createdAt: "2025-09-22" },
  { id: 14, title: "새롭게 신설된 뮤지컬관을 소개합니다", createdAt: "2025-09-22" },
  { id: 13, title: "거리두기 지침에 따른 좌석 운영 변경 안내", createdAt: "2025-09-22" },
  { id: 12, title: "근로자의 날 휴무 안내", createdAt: "2025-09-22" },
  { id: 11, title: "네이버 페이 결제수단 추가 안내", createdAt: "2025-09-22" },
  // 필요 시 더 추가
];
