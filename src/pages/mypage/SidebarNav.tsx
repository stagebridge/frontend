import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export type MyPageSectionKey = "profile" | "tickets" | "settings" | "support";

type Props = {
  active: MyPageSectionKey;
  setActive: Dispatch<SetStateAction<MyPageSectionKey>>;
};

export default function SidebarNav({ active, setActive }: Props) {
  const { t } = useTranslation();

  const items: Array<{ key: MyPageSectionKey; label: string }> = [
    { key: "profile", label: t("mypage.nav.profile") },
    { key: "tickets", label: t("mypage.nav.tickets") },
    { key: "settings", label: t("mypage.nav.settings") },
    { key: "support", label: t("mypage.nav.support") },
  ];

  return (
    <nav className="sb-surface-soft p-4">
      <p className="mb-3 text-xs font-semibold sb-text-muted">
        {t("mypage.nav.title")}
      </p>

      <ul className="space-y-2">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => setActive(it.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-slate-700 hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
