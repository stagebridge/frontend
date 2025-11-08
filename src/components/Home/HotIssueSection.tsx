// src/components/Home/HotIssueSection.tsx
import { useEffect, useRef } from "react";
import HotIssueCard from "./HotIssueCard";
import { HOT_ITEMS } from "../../mocks/home.mock";
import type { HotItem } from "../../mocks/home.mock";

const AUTOPLAY_MS = 4000;

export default function HotIssueSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const DATA: HotItem[] = [...HOT_ITEMS, ...HOT_ITEMS, ...HOT_ITEMS];
  const oneSetCount = HOT_ITEMS.length;

  const stepRef = useRef<number>(0);
  const baseLeftRef = useRef<number>(0);
  const curIndexRef = useRef<number>(0);

  const calcStep = () => {
    const el = listRef.current;
    if (!el) return 0;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length < 2) return cards[0]?.offsetWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const jumpToMiddleStart = () => {
    const el = listRef.current;
    if (!el) return;
    const oneSetWidth = (el.scrollWidth / 3) | 0;
    baseLeftRef.current = oneSetWidth;
    el.scrollTo({ left: baseLeftRef.current });
    curIndexRef.current = 0;
  };

  const scrollToIndex = (idx: number, smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    const left = baseLeftRef.current + idx * stepRef.current;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  const normalizeIfNeeded = () => {
    const el = listRef.current;
    if (!el) return;
    const oneSetWidth = (el.scrollWidth / 3) | 0;
    const left = el.scrollLeft;
    if (left < oneSetWidth * 0.1) {
      el.scrollLeft = baseLeftRef.current + curIndexRef.current * stepRef.current;
    } else if (left > oneSetWidth * 2.9) {
      el.scrollLeft = baseLeftRef.current + curIndexRef.current * stepRef.current;
    }
  };

  const next = () => {
    curIndexRef.current = (curIndexRef.current + 1) % oneSetCount;
    scrollToIndex(curIndexRef.current);
  };

  const prev = () => {
    curIndexRef.current = (curIndexRef.current - 1 + oneSetCount) % oneSetCount;
    scrollToIndex(curIndexRef.current);
  };

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

  useEffect(() => {
    const el = listRef.current;
    const id = window.setTimeout(() => {
      stepRef.current = calcStep();
      jumpToMiddleStart();
    }, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) start();

    const onScroll = () => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => normalizeIfNeeded())
      );
    };
    el?.addEventListener("scroll", onScroll);

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        pausedRef.current = true; stop();
      } else {
        pausedRef.current = false; start();
      }
    };
    document.addEventListener("visibilitychange", onVis);

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

  const handleEnter = () => { pausedRef.current = true; stop(); };
  const handleLeave = () => { pausedRef.current = false; start(); };

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-[25px] font-bold text-slate-800 dark:text-slate-100">
          날 가져요 Cutie Street (핫이슈)
        </h2>

        <div className="flex gap-2">
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
        {DATA.map((it, idx) => (
          <HotIssueCard key={`${it.id}-${idx}`} item={it} />
        ))}
      </div>
    </section>
  );
}
