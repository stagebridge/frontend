// src/components/common/SectionTitle.tsx
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
};

export default function SectionTitle({ title, subtitle, right, className }: Props) {
  return (
    <div className={`mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ${className ?? ""}`}>
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
