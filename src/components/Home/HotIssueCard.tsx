// src/app/components/Home/HotIssueCard.tsx
import type { HotItem } from "@/mocks/home.mock";

export default function HotIssueCard({ item }: { item: HotItem }) {
  return (
    <article data-card className="snap-start w-72 shrink-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-neutral-800">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
        {item.title}
      </h3>
      {item.period && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.period}</p>
      )}
    </article>
  );
}
