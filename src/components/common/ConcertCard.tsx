import type { Concert } from "@/mocks/ranking.mock";

export default function ConcertCard({ c }: { c: Concert }) {
  return (
    <article className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 transition hover:shadow-md dark:bg-neutral-900 dark:ring-neutral-800">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        <img src={c.imageUrl} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="px-3 pb-3 pt-2">
        <h3 className="line-clamp-1 text-[14px] font-semibold text-slate-800 dark:text-slate-100">{c.title}</h3>
        <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{c.period}</p>
      </div>
    </article>
  );
}
