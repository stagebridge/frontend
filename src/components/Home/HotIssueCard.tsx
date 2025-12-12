// src/components/Home/HotIssueCard.tsx
import { Link } from "react-router-dom";

export type HotIssueView = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  period: string;
};

type Props = {
  item: HotIssueView;
};

export default function HotIssueCard({ item }: Props) {
  const { id, title, subtitle, imageUrl, period } = item;

  return (
    // ⭐ 슬라이더가 인식할 수 있도록 data-card + 고정 폭 부여
    <div
      data-card
      className="shrink-0 w-[calc((100%-48px)/4)] max-w-[320px]"
    >
      <Link to={`/concerts/${id}`} className="block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-md dark:bg-neutral-900 dark:ring-neutral-800">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
            <h3 className="line-clamp-2 text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 line-clamp-2 text-[12px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              {period}
            </p>
          </div>
        </article>
      </Link>
    </div>
  );
}
