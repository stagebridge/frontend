import { useLocation, useNavigate } from "react-router-dom";

type Reservation = {
  reservationId: string;
  performanceId: string;
  performanceTitle: string;
  performancePlace: string;
  posterUrl?: string;
  date: string;
  quantity: number;
  createdAt: string;
};

const STORAGE_KEY = "stagebridge_reservations";

export default function ReserveComplete() {
  const location = useLocation();
  const nav = useNavigate();

  const state = location.state as Reservation | null;

  // state가 없으면 최근 예약 1건을 로컬에서 가져옴
  let reservation: Reservation | null = state;

  if (!reservation) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Reservation[] = raw ? JSON.parse(raw) : [];
      reservation = list[0] ?? null;
    } catch {
      reservation = null;
    }
  }

  if (!reservation) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold">예매 완료</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          표시할 예약 정보가 없습니다.
        </p>

        <button
          type="button"
          onClick={() => nav("/")}
          className="mt-6 rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          홈으로
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        예매가 완료되었습니다
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl border dark:border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-4">
            {reservation.posterUrl ? (
              <img
                src={reservation.posterUrl}
                alt={`${reservation.performanceTitle} 포스터`}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-neutral-500">
                이미지가 없습니다.
              </div>
            )}
          </div>

          <div className="p-6 md:col-span-8">
            <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {reservation.performanceTitle}
            </div>
            <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {reservation.performancePlace}
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">예약번호</dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {reservation.reservationId}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">날짜</dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {reservation.date}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">인원</dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  {reservation.quantity}명
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">결제</dt>
                <dd className="font-medium text-neutral-900 dark:text-neutral-100">
                  현장 결제
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => nav("/")}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
              >
                홈으로
              </button>

              <button
                type="button"
                onClick={() => nav(`/concerts/${reservation.performanceId}`)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold dark:border-neutral-800"
              >
                공연으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
