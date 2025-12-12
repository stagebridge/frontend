import React, { PropsWithChildren } from "react";

export default function SectionCard({
  id,
  title,
  extra,
  children,
}: PropsWithChildren<{ id: string; title: string; extra?: React.ReactNode }>) {
  return (
    <section
      id={id}
      // 헤더 높이만큼 스크롤 여유
      className="scroll-mt-[calc(var(--header-h)+8px)]">
      <div className="rounded-xl border p-4 dark:border-neutral-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>
          {extra}
        </div>
        {children}
      </div>
    </section>
  );
}
