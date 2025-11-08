export interface HotItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  period: string;
};

export const HOT_ITEMS: HotItem[] = [
  {
    id: "1",
    title: "かわいいなべがしてくれますか？",
    subtitle: "부제/설명 자리(2줄 제한)",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
    period: "2025.10.02 ~ 2025.10.03",
  },
  {
    id: "2",
    title: "かわいだけじゃだめですか？",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    period: "2025.10.02 ~ 2025.10.03",
  },
  {
    id: "3",
    title: "多元稔編",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    period: "2025.10.02 ~ 2025.10.03",
  },
];
