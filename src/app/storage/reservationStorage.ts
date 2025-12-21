// src/app/storage/reservationStorage.ts

export type Reservation = {
  reservationId: string;
  userId: string; // ✅ 로그인 사용자 식별자
  performanceId: string;
  performanceTitle: string;
  performancePlace: string;
  posterUrl?: string;
  date: string; // YYYY-MM-DD
  quantity: number;
  createdAt: string; // ISO
};

const STORAGE_KEY = "stagebridge_reservations";
const MAX_ITEMS = 50;

export function loadReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as Reservation[]) : [];
    if (!Array.isArray(list)) return [];
    return list;
  } catch {
    return [];
  }
}

export function saveReservations(list: Reservation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {
    // 저장 실패는 UX를 깨지 않도록 조용히 무시
  }
}

export function addReservation(reservation: Reservation): void {
  const list = loadReservations();
  list.unshift(reservation);
  saveReservations(list);
}

export function loadReservationsByUser(userId: string): Reservation[] {
  return loadReservations().filter((r) => r.userId === userId);
}

export function removeReservation(reservationId: string): void {
  const list = loadReservations().filter((r) => r.reservationId !== reservationId);
  saveReservations(list);
}

export function clearReservationsByUser(userId: string): void {
  const list = loadReservations().filter((r) => r.userId !== userId);
  saveReservations(list);
}
