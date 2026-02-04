// src/components/Navbar/AuthLinks.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  variant?: "desktop" | "mobile";
  className?: string;
};

export default function AuthLinks({ variant = "desktop", className }: Props) {
  const { t } = useTranslation();

  // ✅ 네비게이션 문구는 common이 아니라 navbar 네임스페이스로 통일
  const loginLabel = t("navbar.login");
  const signupLabel = t("navbar.signup");

  // 데스크톱(헤더 우측 링크형)
  if (variant === "desktop") {
    return (
      <div className={`flex items-center gap-3 ${className ?? ""}`}>
        <Link
          to="/login"
          className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          {loginLabel}
        </Link>

        <Link
          to="/signup"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          {signupLabel}
        </Link>
      </div>
    );
  }

  // 모바일(메뉴 내부 버튼형)
  return (
    <div className={`grid grid-cols-2 gap-2 ${className ?? ""}`}>
      <Link
        to="/login"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-white dark:hover:bg-neutral-900"
      >
        {loginLabel}
      </Link>

      <Link
        to="/signup"
        className="rounded-xl bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {signupLabel}
      </Link>
    </div>
  );
}
