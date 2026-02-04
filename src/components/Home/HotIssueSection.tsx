// src/components/Home/HotIssueSection.tsx
import { useEffect, useState } from "react";
import HotIssueCard, { type HotIssueView } from "./HotIssueCard";
import { fetchPerformances, type PerformanceSummary } from "../../api/performances";

const toHotIssueView = (p: PerformanceSummary): HotIssueView => ({
  id: p.id,
  title: p.name,
  subtitle: [p.area, p.genre].filter(Boolean).join(" · ") || undefined,
  period: p.period,
  imageUrl: p.posterUrl?.trim()
    ? p.posterUrl
    : "https://placehold.co/800x500?text=No+Image",
});

export default function HotIssueSection() {
  const [items, setItems] = useState<HotIssueView[]>([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const data = await fetchPerformances();
        if (!ignore) setItems(data.slice(0, 8).map(toHotIssueView)); // ✅ 피그마처럼 4x2 정도가 안정적
      } catch {
        if (!ignore) setItems([]);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="pt-14">
      <header className="mb-6">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          실시간 핫이슈
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          지금 가장 인기 있는 공연을 확인하세요.
        </p>
      </header>

      {items.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <HotIssueCard key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-slate-200 bg-white/60 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          조건에 맞는 공연이 없습니다.
        </div>
      )}
    </section>
  );
}
