export default function Notice() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 상단 타이틀 */}
      <header className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          고객센터
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[260px_1fr]">
        {/* 좌측 사이드 */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-slate-200 px-5 py-4 text-[15px] font-semibold dark:border-neutral-800">
            고객센터
          </div>
          <nav className="p-3">
            <ul className="space-y-1 text-[14px]">
              <li>
                <span className="flex items-center justify-between rounded-lg bg-slate-900/90 px-4 py-2.5 font-medium text-white dark:bg-slate-100 dark:text-slate-900">
                  공지사항
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-800/60">
                  자주 묻는 질문
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-800/60">
                  1:1 문의
                </span>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 우측 컨텐츠 */}
        <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* 섹션 헤더 */}
          <div className="border-b border-slate-200 px-6 py-4 text-[15px] font-semibold dark:border-neutral-800">
            공지사항
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <colgroup>
                <col className="w-20" />
                <col />
                <col className="w-36" />
              </colgroup>

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-[13px] font-semibold text-slate-700 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-slate-200">
                  <th className="px-6 py-3">번호</th>
                  <th className="px-6 py-3">제목</th>
                  <th className="px-6 py-3">작성일</th>
                </tr>
              </thead>

              <tbody className="text-[14px]">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-16 text-center text-slate-500 dark:text-slate-400"
                  >
                    공지사항이 아직 등록되지 않았습니다.
                    <br />
                    추후 업데이트될 예정입니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 푸터(간단) */}
      <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-neutral-800">
        StageBridge © 2025
      </footer>
    </div>
  );
}
