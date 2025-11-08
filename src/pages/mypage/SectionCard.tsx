import { ReactNode } from "react";

export default function SectionCard({ id, title, extra, children }: { id: string; title: string; extra?: ReactNode; children: ReactNode; }) {
  return (
    <section id={id} className="rounded-xl border bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}
