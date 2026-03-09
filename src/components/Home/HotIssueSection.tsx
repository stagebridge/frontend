// src/components/Home/HotIssueSection.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HotIssueCard, { type HotIssueView } from "./HotIssueCard";
import {
  fetchPerformances,
  type PerformanceSummary,
} from "../../api/performances";

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
  const { t } = useTranslation();
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
          {t("home.hotIssue.title")}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          {t("home.hotIssue.description")}
        </p>
      </header>

      {items.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="sb-animate-rise"
              style={{ animationDelay: `${80 + Math.min(idx, 8) * 60}ms` }}
            >
              <HotIssueCard item={it} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-slate-200 bg-white/60 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {t("common.empty")}
        </div>
      )}
    </section>
  );
}
