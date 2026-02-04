import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BrandLink from "./BrandLink";
import SearchInput from "./SearchInput";
import LanguageButton from "./LanguageButton";
import ThemeToggle from "./ThemeToggle";
import AuthLinks from "./AuthLinks";

export default function Navbar() {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition",
      isActive
        ? "bg-slate-900 text-white dark:bg-white/10 dark:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b",
        // ✅ 라이트 모드: 선명하게
        "border-slate-200 bg-white",
        // ✅ 다크 모드: 피그마 톤(반투명 + blur)
        "dark:border-white/10 dark:bg-[#0b0f15]/70 dark:backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-6 px-6">
        <div className="flex shrink-0 items-center">
          <BrandLink />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchInput />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <NavLink to="/search" className={linkClass}>
              {t("navbar.concerts", "공연")}
            </NavLink>
            <NavLink to="/notice" className={linkClass}>
              {t("navbar.notice", "공지사항")}
            </NavLink>
            <NavLink to="/mypage" className={linkClass}>
              {t("navbar.mypage", "마이페이지")}
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              {t("navbar.favorites", "찜 목록")}
            </NavLink>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageButton />
          <div className="mx-1 hidden h-5 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />
          <ThemeToggle />
          <div className="mx-1 hidden h-5 w-px bg-slate-200/80 dark:bg-white/10 sm:block" />
          <AuthLinks />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 pb-3 md:hidden">
        <SearchInput />
      </div>
    </header>
  );
}
