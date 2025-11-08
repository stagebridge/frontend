// --- 타입
export type Concert = {
  id: string;
  title: string;
  imageUrl: string;
  period: string;
  country: "KR" | "JP";
  genre?: string;   // 장르
  region?: string;  // 지역(예: 서울, 오사카 등)
};

// --- 카테고리(칩)
export const GENRES = ["아이돌", "밴드", "힙합", "록/메탈", "클래식", "버츄얼"] as const;
export const REGIONS = ["후쿠오카", "도쿄", "간토", "주부", "간사이", "시코쿠", "큐슈·오키나와"] as const;

// --- 더미 데이터 (필요 시 이미지 URL만 교체)
const BASE: Concert[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `c${i + 1}`,
  title: i % 3 === 0 ? "多元稔編" : i % 3 === 1 ? "かわいいなべがしてくれますか？" : "かわいだけじゃだめですか？",
  imageUrl:
    i % 3 === 0
      ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
      : i % 3 === 1
      ? "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
  period: "2025.10.02 ~ 2025.10.03",
  country: i % 2 === 0 ? "JP" : "KR",
  genre: GENRES[i % GENRES.length],
  region: REGIONS[i % REGIONS.length],
}));

// --- API 대체 예정
export async function fetchTopByGenre(genre: string, limit = 6): Promise<Concert[]> {
  await new Promise(r => setTimeout(r, 200)); // 로딩 체감
  return BASE.filter(c => c.genre === genre).slice(0, limit);
}

export async function fetchTopByRegion(region: string, limit = 6): Promise<Concert[]> {
  await new Promise(r => setTimeout(r, 200));
  return BASE.filter(c => c.region === region).slice(0, limit);
}
