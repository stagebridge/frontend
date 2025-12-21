// src/components/Home/HotIssueSection.tsx
import { useEffect, useRef, useState } from "react";
import HotIssueCard, { type HotIssueView } from "./HotIssueCard";
import { fetchPerformances, type PerformanceSummary } from "../../api/performances";

const AUTOPLAY_MS = 5000;

const toHotIssueView = (p: PerformanceSummary): HotIssueView => ({
  id: p.id,
  title: p.name,
  subtitle: [p.area, p.genre].filter(Boolean).join(" · ") || undefined,
  period: p.period,
  imageUrl: p.posterUrl?.trim()
    ? p.posterUrl
    : "https://placehold.co/600x400?text=No+Image",
  // ✅ performance: p  ← 이 줄이 타입 오류의 원인이라 제거합니다.
});

export default function HotIssueSection() {
  const [items, setItems] = useState<HotIssueView[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const data = await fetchPerformances();
        if (!ignore) setItems(data.slice(0, 10).map(toHotIssueView));
      } catch {
        if (!ignore) setItems([]);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const moveNext = () => {
    const el = listRef.current;
    if (!el) return;

    const firstCard = el.querySelector("[data-card]") as HTMLElement | null;
    if (!firstCard) return;

    const step = firstCard.offsetWidth + 16; // gap-4 = 16px
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (el.scrollLeft + step >= maxScroll) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(moveNext, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
          [실시간 핫이슈]
        </h2>
      </div>

      <div
        ref={listRef}
        className="flex gap-4 overflow-x-auto pb-2"
        onMouseEnter={() => {
          if (timerRef.current) window.clearInterval(timerRef.current);
        }}
        onMouseLeave={() => {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = window.setInterval(moveNext, AUTOPLAY_MS);
        }}
      >
        {items.map((item) => (
          <div key={item.id} data-card>
            <HotIssueCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
