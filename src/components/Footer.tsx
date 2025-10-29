export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white/70 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* 상단: 3열 */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* 브랜드/저작권 */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <div className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              StageBridge©2025
            </div>
          </div>

          {/* 사이트 링크 */}
          <nav aria-label="사이트 정보" className="text-sm">
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li><a className="hover:underline" href="#">회사 소개</a></li>
              <li><a className="hover:underline" href="#">이용약관</a></li>
              <li><a className="hover:underline" href="#">개인정보처리방침</a></li>
              <li><a className="hover:underline" href="#">고객센터</a></li>
            </ul>
          </nav>

          {/* 우측: SNS / 언어 / 연락처 */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {/* SNS */}
            <div className="text-sm">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">SNS</div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>🅕</span> facebook
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>📸</span> Instagram
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-2 hover:underline" href="#">
                    <span aria-hidden>▶️</span> Youtube
                  </a>
                </li>
              </ul>
            </div>

            {/* 언어 */}
            <div className="text-sm">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">언어</div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><a className="hover:underline" href="#">한국어</a></li>
                <li><a className="hover:underline" href="#">日本語</a></li>
                <li><a className="hover:underline" href="#">English</a></li>
              </ul>
            </div>

            {/* 연락처 */}
            <div className="text-sm sm:col-span-1 col-span-2">
              <div className="mb-2 font-medium text-slate-800 dark:text-slate-100">문의</div>
              <a className="text-slate-700 hover:underline dark:text-slate-300" href="mailto:stagebridge@info.com">
                stagebridge@info.com
              </a>
            </div>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs text-slate-500 dark:border-neutral-800 dark:text-slate-400 sm:flex-row">
          <p>© 2025 StageBridge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">개인정보 설정</a>
            <a className="hover:underline" href="#">쿠키 정책</a>
            <a className="hover:underline" href="#top">맨 위로 ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
