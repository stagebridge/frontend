// src/components/Home/HotIssueCard.tsx
import { Link } from "react-router-dom";

export type HotIssueView = {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  imageUrl: string;
};

export default function HotIssueCard({ item }: { item: HotIssueView }) {
  return (
    <Link
      to={`/concerts/${item.id}`}
      className={[
        "group relative block overflow-hidden rounded-2xl",
        "border border-slate-200 bg-white shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
        "dark:border-white/10 dark:bg-white/5 dark:shadow-none",
        "dark:hover:bg-white/7 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
      ].join(" ")}
      aria-label={`${item.title} 상세 보기`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* ✅ 피그마 느낌의 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="line-clamp-2 text-sm font-extrabold leading-5 text-white">
            {item.title}
          </h4>
          <p className="mt-1 line-clamp-1 text-xs text-white/80">
            {item.subtitle ?? "공연 정보"}
          </p>
          {item.period ? (
            <p className="mt-1 line-clamp-1 text-xs text-white/80">{item.period}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
