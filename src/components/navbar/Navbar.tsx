import { useNavigate } from "react-router-dom";
import BrandLink from "./BrandLink";
import LanguageButton from "./LanguageButton";
import ThemeToggle from "./ThemeToggle";
import NotificationIcon from "./NotificationIcon";
import AuthLinks from "./AuthLinks";

export default function Navbar() {
  const nav = useNavigate();

  return (
    // 헤더 자체에도 텍스트색을 명시해 대비 확보
    <header
      className="w-full border-b border-[#eaecef] bg-white text-slate-900 dark:bg-[#0f1115] dark:text-slate-100"
      role="banner"
    >
      <div className="mx-auto w-[1200px] grid h-16 grid-cols-[200px_1fr_auto] items-center gap-4">
        <div className="flex items-center">
          <BrandLink />
        </div>

        <div className="flex items-center">
          <form role="search" className="w-full" onSubmit={(e) => e.preventDefault()}>
            <input
              className="w-full h-9 rounded-lg border border-[#d0d7de] px-3 outline-none
                         bg-white text-slate-900 placeholder:text-slate-400
                         dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="한국과 일본의 콘서트를 검색해요"
            />
          </form>
        </div>

        <div className="flex items-center justify-end gap-3">
          <LanguageButton />
          <ThemeToggle />
          <NotificationIcon />
          <AuthLinks />
          <button
            type="button"
            onClick={() => nav("/tickets")}
            className="inline-flex h-9 items-center px-3 bg-transparent
                       text-slate-900 dark:text-slate-100
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            예매하기
          </button>
        </div>
      </div>
    </header>
  );
}
