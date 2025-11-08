import { Link } from "react-router-dom";
import type { HotItem } from "../../mocks/home.mock";

type Props = { item: HotItem };

export default function HotIssueCard({ item }: Props) {
  return (
    <Link
      to={`/concert/${item.id}`}
      data-card
      className="
        group
        basis-[300px] md:basis-[340px] lg:basis-[360px]
        shrink-0 snap-start
        overflow-hidden rounded-xl border bg-white shadow-sm
        transition hover:shadow-md
        dark:border-neutral-800 dark:bg-neutral-900
      "
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm font-medium">{item.title}</h3>
        {item.subtitle && (
          <p className="line-clamp-2 text-xs text-neutral-500">
            {item.subtitle}
          </p>
        )}
        <p className="text-xs text-neutral-500">{item.period}</p>
      </div>
    </Link>
  );
}
