// src/pages/mypage/TicketsSection.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  clearReservationsByUser,
  loadReservationsByUser,
  removeReservation,
  type Reservation,
} from "../../app/storage/reservationStorage";

export default function TicketsSection() {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const [tick, setTick] = useState(0);

  const list = useMemo(() => {
    if (!userId) return [];
    return loadReservationsByUser(userId);
  }, [userId, tick]);

  const onRemoveOne = (reservationId: string) => {
    if (!confirm("해당 예매 내역을 삭제하시겠습니까?")) return;
    removeReservation(reservationId);
    setTick((v) => v + 1);
  };

  const onClearAll = () => {
    if (!userId) return;
    if (!confirm("예매 내역을 모두 삭제하시겠습니까?")) return;
    clearReservationsByUser(userId);
    setTick((v) => v + 1);
  };

  if (!userId) {
    return (
      <div className="text-sm sb-text-muted">
        사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm sb-text-muted">
          총 <b className="text-slate-900 dark:text-slate-100">{list.length}</b>건
        </p>

        {list.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            전체 삭제
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm sb-text-muted dark:border-slate-700 dark:bg-slate-900">
          예매 내역이 없습니다. 공연 상세 페이지에서 예매를 진행해 주세요.
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li
              key={r.reservationId}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <div className="h-20 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  {r.posterUrl ? (
                    <img src={r.posterUrl} alt={r.performanceTitle} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <Link
                    to={`/concerts/${r.performanceId}`}
                    className="block truncate text-sm font-extrabold text-slate-900 hover:underline dark:text-slate-100"
                    title={r.performanceTitle}
                  >
                    {r.performanceTitle}
                  </Link>
                  <p className="mt-1 text-xs sb-text-muted">{r.performancePlace}</p>
                  <p className="mt-2 text-xs sb-text-muted">
                    관람일: <b className="text-slate-900 dark:text-slate-100">{r.date}</b>
                    {" · "}
                    수량: <b className="text-slate-900 dark:text-slate-100">{r.quantity}</b>
                  </p>
                  <p className="mt-1 text-[11px] sb-text-muted">
                    예약일시: {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to={`/concerts/${r.performanceId}`}
                  className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
                >
                  공연 보기
                </Link>

                <button
                  type="button"
                  onClick={() => onRemoveOne(r.reservationId)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
