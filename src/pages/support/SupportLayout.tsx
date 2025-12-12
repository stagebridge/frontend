import { NavLink, Outlet } from "react-router-dom";

export default function SupportLayout() {
  const tabs = [
    { to: "/support", label: "공지사항", end: true },
    { to: "/support/faq", label: "FAQ" },
    { to: "/support/inquiry", label: "문의하기" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">고객지원</h1>
      </div>

      <nav className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              [
                "rounded-lg border px-3 py-2 text-sm",
                "dark:border-neutral-700",
                isActive
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800",
              ].join(" ")
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* 하위 라우트 렌더링 */}
      <Outlet />
    </main>
  );
}
