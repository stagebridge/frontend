import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({ title, description, children, className = "" }: Props) {
  return (
    <section className={`sb-surface p-6 ${className}`}>
      <header className="mb-4">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm sb-text-muted">{description}</p>
        ) : null}
      </header>

      <div>{children}</div>
    </section>
  );
}
