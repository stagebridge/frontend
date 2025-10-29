// src/app/components/Home/HotIssueSection.tsx
import { useEffect, useRef } from "react";
import HotIssueCard from "./HotIssueCard";
import { HOT_ITEMS } from "@/mocks/home.mock";
import type { HotItem } from "@/mocks/home.mock";

const AUTOPLAY_MS = 4000;

export default function HotIssueSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  // 무한 루프: 원본을 3배로
  const DATA: HotItem[] = [...HOT_ITEMS, ...HOT_ITEMS, ...HOT_ITEMS];
  const oneSetCount = HOT_ITEMS.length;

  // 계산용 상태
  const stepRef = useRef<number>(0);      // 카드 1장 + gap 픽셀
  const baseLeftRef = useRef<number>(0);  // 중앙 세트 시작점의 scrollLeft
  const curIndexRef = useRef<number>(0);  // 중앙 세트 기준 인덱스(0..oneSetCount-1)

  // 카드 간 거리(step) 계산: 0번과 1번 카드의 offset 차이
  const calcStep = () => {
    const el = listRef.current;
    if (!el) return 0;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length < 2) return cards[0]?.offsetWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft; // gap 포함
  };

  // 중앙 세트 시작 위치로 이동
  const jumpToMiddleStart = () => {
    const el = listRef.current;
    if (!el) return;
    const oneSetWidth = (el.scrollWidth / 3) | 0;
    baseLeftRef.current = oneSetWidth; // 중앙 세트 시작점
    el.scrollTo({ left: baseLeftRef.current }); // 즉시 이동
    curIndexRef.current = 0;
  };

  // 현재 인덱스로 부드럽게 이동
  const scrollToIndex = (idx: number, smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    const left = baseLeftRef.current + idx * stepRef.current;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  // 경계 보정: 좌/우 끝으로 넘어가면 중앙 세트 동일 위치로 점프
  const normalizeIfNeeded = () => {
    const el = listRef.current;
    if (!el) return;
    const oneSetWidth = (el.scrollWidth / 3) | 0;
    const left = el.scrollLeft;

    if (left < oneSetWidth * 0.1) {
      // 왼쪽 세트에 가까움 → 같은 인덱스만큼 중앙으로
      el.scrollLeft = baseLeftRef.current + curIndexRef.current * stepRef.current;
    } else if (left > oneSetWidth * 2.9) {
      // 오른쪽 세트에 가까움 → 같은 인덱스만큼 중앙으로
      el.scrollLeft = baseLeftRef.current + curIndexRef.current * stepRef.current;
    }
  };

  const next = () => {
    curIndexRef.current = (curIndexRef.current + 1) % oneSetCount;
    scrollToIndex(curIndexRef.current);
  };

  const prev = () => {
    curIndexRef.current =
      (curIndexRef.current - 1 + oneSetCount) % oneSetCount;
    scrollToIndex(curIndexRef.current);
  };

  // 오토플레이
  const start = () => {
    if (timerRef.current || pausedRef.current) return;
    timerRef.current = window.setInterval(() => {
      if (!pausedRef.current) next();
    }, AUTOPLAY_MS);
  };
  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 초기화
  useEffect(() => {
    const el = listRef.current;
    // 렌더 완료 후 한 프레임 뒤에 계산
    const id = window.setTimeout(() => {
      stepRef.current = calcStep();
      jumpToMiddleStart();
    }, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) start();

    // 스크롤 끝나면 경계 보정
    const onScroll = () => {
      // 두 번의 rAF로 스무스 스크롤 종료 후 보정
      requestAnimationFrame(() =>
        requestAnimationFrame(() => normalizeIfNeeded())
      );
    };
    el?.addEventListener("scroll", onScroll);

    // 탭 전환 시 일시정지/재개
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        pausedRef.current = true; stop();
      } else {
        pausedRef.current = false; start();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // 리사이즈 시 step 재계산 + 현재 인덱스로 재배치
    const onResize = () => {
      stepRef.current = calcStep();
      scrollToIndex(curIndexRef.current, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(id);
      el?.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  // 호버 시 일시정지/해제
  const handleEnter = () => { pausedRef.current = true; stop(); };
  const handleLeave = () => { pausedRef.current = false; start(); };

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-[25px] font-bold text-slate-800 dark:text-slate-100">
          날 가져요 Cutie Street (핫이슈)
        </h2>

        <div className="hidden gap-2 sm:flex">
          <button
            onClick={prev}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-black/5 dark:border-neutral-700 dark:hover:bg-white/10"
            aria-label="이전"
          >
            ←
          </button>
          <button
            onClick={next}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-black/5 dark:border-neutral-700 dark:hover:bg-white/10"
            aria-label="다음"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="no-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2"
      >
        {([...HOT_ITEMS, ...HOT_ITEMS, ...HOT_ITEMS] as HotItem[]).map(
          (it, idx) => (
            <HotIssueCard key={`${it.id}-${idx}`} item={it} />
          )
        )}
      </div>
    </section>
  );
}
