import { Link } from "react-router-dom";

type Props = {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
};

export default function EmptyStateV2({ title, description, ctaLabel, ctaTo }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-neutral-700">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}

      {ctaLabel && ctaTo ? (
        <div className="mt-5">
          <Link className="sb-btn inline-flex items-center justify-center" to={ctaTo}>
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
