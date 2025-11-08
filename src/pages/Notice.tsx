// src/pages/Notice.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { NOTICES } from "../mocks/notice.mock";

const PER_PAGE = 10;

export default function Notice() {
  const [page, setPage] = useState(1);

  const total = NOTICES.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));

  const list = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return NOTICES.slice(start, start + PER_PAGE);
  }, [page]);

  const go = (p: number) => {
    if (p < 1 || p > maxPage) return;
    setPage(p);
  };

  // 페이지 번호는 최대 5개만 노출(현재 페이지 기준)
  const pageWindow = useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(maxPage, start + windowSize - 1);
    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, maxPage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 상단 타이틀 */}
      <header className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
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
                {list.map((n) => (
                  <tr
                    key={n.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-6 py-4 align-top text-slate-500">{n.id}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/notice/${n.id}`}
                        className="line-clamp-1 text-slate-900 hover:underline dark:text-slate-100"
                      >
                        {n.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 align-top text-slate-500">
                      {n.createdAt}
                    </td>
                  </tr>
                ))}

                {list.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-center gap-2 px-6 py-5">
            <button
              onClick={() => go(page - 1)}
              disabled={page === 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
            >
              이전
            </button>

            {pageWindow[0] > 1 && (
              <>
                <button
                  onClick={() => go(1)}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-neutral-800"
                >
                  1
                </button>
                <span className="px-1 text-slate-400">…</span>
              </>
            )}

            {pageWindow.map((p) => (
              <button
                key={p}
                onClick={() => go(p)}
                className={
                  p === page
                    ? "rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                    : "rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-neutral-800"
                }
              >
                {p}
              </button>
            ))}

            {pageWindow[pageWindow.length - 1] < maxPage && (
              <>
                <span className="px-1 text-slate-400">…</span>
                <button
                  onClick={() => go(maxPage)}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-neutral-800"
                >
                  {maxPage}
                </button>
              </>
            )}


            <button
              onClick={() => go(page + 1)}
              disabled={page === maxPage}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
            >
              다음
            </button>
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
