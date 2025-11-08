import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLink from "./BrandLink";
import SearchInput from "./SearchInput";
import LanguageButton from "./LanguageButton";
import ThemeToggle from "./ThemeToggle";
import NotificationIcon from "./NotificationIcon";
import AuthLinks from "./AuthLinks";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const handleNav = () => setOpen(false);

  const textLinkClass =
    "text-sm font-medium tracking-tight text-slate-700 hover:text-slate-900 transition " +
    "dark:text-slate-200 dark:hover:text-white";

  return (
    <header
      className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur
                 dark:bg-neutral-900/80 dark:border-neutral-800"
    >
      {/* 높이 확장 */}
      <div className="mx-auto flex min-h-24 max-w-7xl items-center gap-4 px-6 py-4">
        {/* 왼쪽: 로고 */}
        <div className="shrink-0">
          <BrandLink />
        </div>

        {/* 가운데: 검색 */}
        <div className="flex flex-1 justify-center">
          <SearchInput />
        </div>

        {/* 오른쪽: 2단 구조 */}
        <div className="hidden md:flex min-w-[420px] flex-col items-end gap-3">
          {/* 상단: 로그인 / 회원가입 */}
          <div className="text-[15px] text-slate-600 dark:text-slate-300">
            <AuthLinks />
          </div>

          {/* 하단: 아이콘 + 텍스트 링크들 */}
          <div className="flex items-center gap-6">
            <LanguageButton />
            <ThemeToggle />
            <NotificationIcon />

            {/* 예매하기 (텍스트 링크) */}
            <Link to="/reserve" className={textLinkClass} aria-label="예매하기 페이지로 이동">
              예매하기
            </Link>

            {/* ✅ 마이페이지도 텍스트 링크로 */}
            <Link to="/me" className={textLinkClass} aria-label="마이페이지로 이동">
              마이페이지
            </Link>
          </div>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="ml-auto rounded-lg border px-3 py-2 text-sm md:hidden dark:border-neutral-700"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="모바일 메뉴 토글"
        >
          ☰
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav id="mobile-menu" className="border-t md:hidden dark:border-neutral-800">
          <ul className="m-0 flex list-none flex-col gap-3 p-4">
            {/* 로그인/회원가입 */}
            <li className="text-sm text-slate-700 dark:text-slate-300">
              <AuthLinks />
            </li>

            {/* 아이콘 */}
            <li className="flex items-center gap-3">
              <LanguageButton />
              <ThemeToggle />
              <NotificationIcon />
            </li>

            {/* 예매하기/마이페이지: 버튼이 아닌 텍스트 링크로 표기 */}
            <li className="flex items-center justify-end gap-4 text-sm">
              <Link to="/reserve" onClick={handleNav} className={textLinkClass}>
                예매하기
              </Link>
              <Link to="/me" onClick={handleNav} className={textLinkClass}>
                마이페이지
              </Link>
            </li>

            {/* 필요 시: 로그인/회원가입을 직접 표기해서 클릭 시 메뉴 닫기 */}
            <li className="mt-1 flex items-center justify-end gap-3 text-sm">
              <Link
                to="/login"
                onClick={handleNav}
                className="rounded-lg border px-3 py-1.5 dark:border-neutral-700"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                onClick={handleNav}
                className="rounded-lg border px-3 py-1.5 dark:border-neutral-700"
              >
                회원가입
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
