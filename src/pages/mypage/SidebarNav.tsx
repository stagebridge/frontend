// src/pages/mypage/SidebarNav.tsx
import { scrollToId } from "../../app/utils/scrollToId";

// 간단한 classnames 유틸 (false/null/undefined 무시)
function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

type Item = { id: string; label: string };

export default function SidebarNav({
  items,
  active,
  className,
}: {
  items: Item[];
  active: string;
  className?: string;
}) {
  return (
    <aside
      className={cx(
        // 카드 스타일
        "rounded-xl border bg-white/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60",
        // 뷰포트 안에서 자체 스크롤
        "max-h-[calc(100vh-96px)] overflow-auto", // 96px ≈ 헤더 높이 (MyPage.tsx의 sticky top과 함께 조정)
        className
      )}
    >
      <ul className="space-y-1">
        {items.map((it) => {
          const is = it.id === active;
          return (
            <li key={it.id}>
              <button
                onClick={() => scrollToId(it.id)}
                className={cx(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                  is
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
