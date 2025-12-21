import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  createSupportPost,
  deleteSupportPost,
  getSupportPost,
  listSupportPosts,
  updateSupportPost,
} from "../api/support";
import {
  type SupportBoardKind,
  type SupportPost,
  type SupportPostStatus,
} from "../types/support";

const TAB_LABEL: Record<SupportBoardKind, string> = {
  notice: "공지사항",
  faq: "자주 묻는 질문",
  inquiry: "1:1 문의",
};

const EMPTY_MESSAGE: Record<SupportBoardKind, string> = {
  notice: "공지사항이 아직 등록되지 않았습니다.\n추후 업데이트될 예정입니다.",
  faq: "등록된 자주 묻는 질문이 없습니다.\n새 질문을 등록해 주세요.",
  inquiry: "등록된 문의가 없습니다.\n새 문의를 등록해 주세요.",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function clampKind(value: string | null): SupportBoardKind {
  if (value === "faq" || value === "inquiry" || value === "notice") return value;
  return "notice";
}

type ModalMode = "create" | "edit";

function PostModal(props: {
  open: boolean;
  mode: ModalMode;
  kind: SupportBoardKind;
  initial?: SupportPost | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { open, mode, kind, initial, onClose, onSaved } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SupportPostStatus>("접수");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSaving(false);
    setTitle(initial?.title ?? "");
    setContent(initial?.content ?? "");
    setStatus(initial?.status ?? "접수");
  }, [open, initial]);

  const titlePlaceholder = useMemo(() => {
    if (kind === "notice") return "예: 시스템 점검 안내";
    if (kind === "faq") return "예: 환불은 어떻게 진행되나요?";
    return "예: 결제 오류 문의";
  }, [kind]);

  const contentPlaceholder = useMemo(() => {
    if (kind === "notice") return "공지 내용을 입력해 주세요.";
    if (kind === "faq") return "질문에 대한 답변(또는 안내)을 입력해 주세요.";
    return "문의 내용을 상세히 입력해 주세요.";
  }, [kind]);

  if (!open) return null;

  const submit = async () => {
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (mode === "create") {
        await createSupportPost({ kind, title: t, content: c, status });
      } else if (initial) {
        await updateSupportPost({ kind, id: initial.id, title: t, content: c, status });
      }
      onSaved();
      onClose();
    } catch {
      setError("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-neutral-800">
          <h2 className="text-[15px] font-semibold">
            {mode === "create" ? `${TAB_LABEL[kind]} 작성` : `${TAB_LABEL[kind]} 수정`}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-800/60"
          >
            닫기
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-700 dark:text-slate-200">
              제목
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:ring-neutral-700"
              placeholder={titlePlaceholder}
            />
          </div>

          {kind === "inquiry" ? (
            <div>
              <label className="mb-1 block text-[13px] font-medium text-slate-700 dark:text-slate-200">
                상태
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SupportPostStatus)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:ring-neutral-700"
              >
                <option value="접수">접수</option>
                <option value="답변완료">답변완료</option>
              </select>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-[13px] font-medium text-slate-700 dark:text-slate-200">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:ring-neutral-700"
              placeholder={contentPlaceholder}
            />
          </div>

          {error ? (
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-800/60"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {saving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostDetail(props: {
  open: boolean;
  post: SupportPost | null;
  kind: SupportBoardKind;
  onClose: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const { open, post, kind, onClose, onEdit, onDeleted } = props;
  const [deleting, setDeleting] = useState(false);
  if (!open || !post) return null;

  const remove = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteSupportPost({ kind, id: post.id });
      onDeleted();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-neutral-800">
          <h2 className="text-[15px] font-semibold">{TAB_LABEL[kind]}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-800/60"
          >
            닫기
          </button>
        </div>

        <div className="space-y-3 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[18px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {kind === "inquiry" && post.status ? (
                <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-neutral-700">
                  {post.status}
                </span>
              ) : null}
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-[14px] leading-6 text-slate-800 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-slate-200">
            {post.content}
          </div>

          {post.updatedAt ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              수정일: {formatDate(post.updatedAt)}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-neutral-800">
          <button
            onClick={remove}
            disabled={deleting}
            className="rounded-xl border border-rose-200 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
          >
            {deleting ? "삭제 중" : "삭제"}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-800/60"
            >
              수정
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notice() {
  const [params, setParams] = useSearchParams();

  const kind = useMemo(() => clampKind(params.get("tab")), [params]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  const [items, setItems] = useState<SupportPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPost, setDetailPost] = useState<SupportPost | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editTarget, setEditTarget] = useState<SupportPost | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const load = async () => {
    setLoading(true);
    try {
      const res = await listSupportPosts({ kind, page, size, q: q.trim() || undefined });
      setItems(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [kind]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, page]);

  const applySearch = () => {
    setPage(1);
    void load();
  };

  const selectTab = (next: SupportBoardKind) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("tab", next);
    setParams(nextParams);
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = () => {
    if (!detailPost) return;
    setEditTarget(detailPost);
    setModalMode("edit");
    setModalOpen(true);
    setDetailOpen(false);
  };

  const openDetail = async (id: string) => {
    const post = await getSupportPost({ kind, id });
    setDetailPost(post);
    setDetailOpen(true);
  };

  const onSaved = () => {
    void load();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          고객센터
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-slate-200 px-5 py-4 text-[15px] font-semibold dark:border-neutral-800">
            고객센터
          </div>
          <nav className="p-3">
            <ul className="space-y-1 text-[14px]">
              {(Object.keys(TAB_LABEL) as SupportBoardKind[]).map((k) => {
                const active = k === kind;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => selectTab(k)}
                      className={
                        active
                          ? "flex w-full items-center justify-between rounded-lg bg-slate-900/90 px-4 py-2.5 font-medium text-white dark:bg-slate-100 dark:text-slate-900"
                          : "block w-full rounded-lg px-4 py-2.5 text-left text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-neutral-800/60"
                      }
                    >
                      {TAB_LABEL[k]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] font-semibold">{TAB_LABEL[kind]}</p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applySearch();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100 dark:focus:ring-neutral-700 sm:w-64"
                  placeholder="검색(제목/내용)"
                />
                <button
                  onClick={applySearch}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-800/60"
                >
                  검색
                </button>
              </div>

              <button
                onClick={openCreate}
                className="rounded-xl bg-slate-900 px-4 py-2 text-[14px] font-medium text-white dark:bg-slate-100 dark:text-slate-900"
              >
                작성
              </button>
            </div>
          </div>

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
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-16 text-center text-slate-500 dark:text-slate-400"
                    >
                      불러오는 중입니다.
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="whitespace-pre-line px-6 py-16 text-center text-slate-500 dark:text-slate-400"
                    >
                      {EMPTY_MESSAGE[kind]}
                    </td>
                  </tr>
                ) : (
                  items.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 hover:bg-slate-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/30"
                    >
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                        {total - ((page - 1) * size + idx)}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => void openDetail(p.id)}
                          className="line-clamp-1 text-left font-medium text-slate-900 hover:underline dark:text-slate-100"
                        >
                          {p.title}
                        </button>
                        {kind === "inquiry" && p.status ? (
                          <span className="ml-2 rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-neutral-700 dark:text-slate-300">
                            {p.status}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                        {formatDate(p.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">총 {total}건</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-40 dark:border-neutral-800 dark:text-slate-200"
              >
                이전
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-40 dark:border-neutral-800 dark:text-slate-200"
              >
                다음
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-neutral-800">
        StageBridge © 2025
      </footer>

      <PostDetail
        open={detailOpen}
        post={detailPost}
        kind={kind}
        onClose={() => setDetailOpen(false)}
        onEdit={openEdit}
        onDeleted={onSaved}
      />

      <PostModal
        open={modalOpen}
        mode={modalMode}
        kind={kind}
        initial={editTarget}
        onClose={() => setModalOpen(false)}
        onSaved={onSaved}
      />
    </div>
  );
}
