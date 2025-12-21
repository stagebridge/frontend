import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPerformanceDetail } from "../api/performances";
import { useAuth } from "../contexts/AuthContext";
import { addReservation, type Reservation } from "../app/storage/reservationStorage";

function ymd(date: Date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toTitle(detail: any) {
  return detail?.name ?? detail?.title ?? detail?.prfnm ?? "공연";
}

function toPlace(detail: any) {
  return detail?.venue ?? detail?.place ?? detail?.fcltynm ?? "-";
}

function toPosterUrl(detail: any) {
  return detail?.posterUrl ?? detail?.poster ?? detail?.posterurl ?? "";
}

export default function Reserve() {
  const { id = "" } = useParams<{ id: string }>();
  const nav = useNavigate();
  const location = useLocation();

  const { isAuthed, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

  const [date, setDate] = useState<string>(() => ymd(new Date()));
  const [qty, setQty] = useState<number>(1);

  // 로그인 후 복귀 경로(필요 시 사용)
  const from = (location.state as any)?.from as string | undefined;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) throw new Error("잘못된 접근입니다.");

        const d = await fetchPerformanceDetail(id);
        if (!cancelled) setDetail(d);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "공연 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, isAuthed]);

  const title = useMemo(() => toTitle(detail), [detail]);
  const place = useMemo(() => toPlace(detail), [detail]);
  const posterUrl = useMemo(() => toPosterUrl(detail), [detail]);

  const canSubmit = useMemo(() => {
    if (!isAuthed) return false;
    if (!id) return false;
    if (!date) return false;
    if (!qty || qty < 1) return false;
    return true;
  }, [isAuthed, id, date, qty]);

  const onComplete = () => {
    if (!canSubmit) return;
    if (!user?.id) {
      alert("사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요.");
      return;
    }

    const reservation: Reservation = {
      reservationId: `r_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      userId: user.id, // ✅ 사용자별 예매내역 분리
      performanceId: id,
      performanceTitle: title,
      performancePlace: place,
      posterUrl: posterUrl || undefined,
      date,
      quantity: qty,
      createdAt: new Date().toISOString(),
    };

    addReservation(reservation);

    nav("/reserve/complete", { state: reservation });
  };

  // 로그인 리다이렉트 중에는 화면 깜빡임을 줄이기 위해 최소 UI만 표시
  if (!isAuthed) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          로그인이 필요합니다. 로그인 페이지로 이동합니다.
        </p>
        <button
          type="button"
          onClick={() => nav("/login", { state: { from: from ?? `/reserve/${id}` } })}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          로그인하러 가기
        </button>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">로딩 중입니다.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => nav(-1)}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          뒤로 가기
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        예매하기
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-xl border bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {posterUrl ? (
            <img src={posterUrl} alt={title} className="h-56 w-full object-cover md:h-64" />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-neutral-500 md:h-64">
              No Image
            </div>
          )}
        </div>

        <section className="rounded-xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{place}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                날짜
              </label>
              <input
                type="date"
                className="mt-2 w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                수량
              </label>
              <input
                type="number"
                min={1}
                className="mt-2 w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
          >
            예매 완료
          </button>
        </section>
      </div>
    </main>
  );
}
