import React from "react";

type Item = { id: string; label: string };

export default function SidebarNav({
  items,
  active,
}: {
  items: Item[];
  active?: string | null;
}) {
  const jump = (id: string) => {
    // 클릭 즉시 활성값도 맞춰 주고
    // (IntersectionObserver가 늦게 반응해도 하이라이트가 맞게 보이도록)
    // setActive를 밖에서 못 쓰니, location hash를 살짝 바꿔 강제 트리거
    history.replaceState(null, "", `#${id}`);

    const el = document.getElementById(id);
    if (!el) return;
    // 오프셋 계산은 SectionCard의 scroll-mt가 처리하므로 순정 스크롤
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside
      className={[
        "hidden md:block",
        // 헤더 높이 + 8px 버퍼를 전역으로 통일
        "sticky top-[calc(var(--header-h)+8px)]",
        "max-h-[calc(100vh-var(--header-h)-8px)] overflow-auto",
        "h-fit self-start rounded-xl border p-3 dark:border-neutral-800",
      ].join(" ")}
    >
      <nav className="flex flex-col gap-1 pr-1">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => jump(it.id)}
              className={[
                "w-full rounded-lg px-3 py-2 text-left text-sm",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800",
              ].join(" ")}
            >
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
