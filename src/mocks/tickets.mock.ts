import type { Ticket } from "../types/ticket";

export const TICKETS: Ticket[] = [
  {
    id: "cs-20250322",
    title: "CUTIE STREET",
    subTitle: "かわいいだけじゃだめですか？",
    dateStart: "2025-03-22",
    venue: "K-アリーナ 横浜",
    priceJPY: 25000,
    region: "JAPAN",
    genre: "IDOL_FEMALE",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200",
  },
  {
    id: "ive-20250901",
    title: "IVE WORLD TOUR [SHOW WHAT I AM]",
    dateStart: "2025-09-01",
    dateEnd: "2025-10-02",
    venue: "Kアリーナ 横浜",
    priceJPY: 25000,
    region: "JAPAN",
    genre: "IDOL_FEMALE",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
  },
];

export function getTicketById(id: string) {
  return TICKETS.find((t) => String(t.id) === String(id));
}

