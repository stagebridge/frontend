// src/components/Home/HotIssueSection.tsx
import { useEffect, useRef, useState } from "react";
import HotIssueCard, { HotIssueView } from "./HotIssueCard";
import { fetchRankedPerformances, type PerformanceSummary } from "../../api/performances";

const AUTOPLAY_MS = 5000;

const toHotIssueView = (p: PerformanceSummary): HotIssueView => ({
  id: p.id,
  title: p.name,
  subtitle: [p.area, p.genre].filter(Boolean).join(" · ") || undefined,
  period: p.period,
  imageUrl: p.posterUrl?.trim()
    ? p.posterUrl
    : "https://placehold.co/600x400?text=No+Image",
});

export default function HotIssueSection() {
  const [items, setItems] = useState<HotIssueView[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // 데이터 로드
  useEffect(() => {
    (async () => {
      const data = await fetchRankedPerformances();
      setItems(data.slice(0, 10).map(toHotIssueView));
    })();
  }, []);

  // 슬라이드 이동
  const moveNext = () => {
    const el = listRef.current;
    if (!el) return;

    const firstCard = el.querySelector("[data-card]") as HTMLElement;
    if (!firstCard) return;

    const step = firstCard.offsetWidth + 16; // 카드폭 + gap
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (el.scrollLeft + step >= maxScroll) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  // 자동 재생
  useEffect(() => {
    if (items.length === 0) return;
    timerRef.current = window.setInterval(moveNext, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-3 text-[26px] font-extrabold">
        [실시간 핫이슈]
      </h2>

      <div
        ref={listRef}
        className="flex gap-4 overflow-hidden pb-4"
        onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
        onMouseLeave={() => {
          timerRef.current = window.setInterval(moveNext, AUTOPLAY_MS);
        }}
      >
        {items.map((item) => (
          <HotIssueCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
