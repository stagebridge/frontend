import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import WriteModal from "./WriteModal";

export type BoardKind = "reviews" | "expectations" | "qa";

export type BoardPost = {
  id: string;
  kind: BoardKind;
  performanceId: string;
  title: string;
  content: string;
  createdAt: string; // ISO
};

type Props = {
  performanceId: string;
  kind: BoardKind;
  title: string;
};

function storageKey(performanceId: string, kind: BoardKind) {
  return `sb:boards:${performanceId}:${kind}`;
}

function loadPosts(performanceId: string, kind: BoardKind): BoardPost[] {
  const key = storageKey(performanceId, kind);
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((v) => typeof v === "object" && v !== null)
      .map((v) => v as BoardPost)
      .filter((p) => p.performanceId === performanceId && p.kind === kind);
  } catch {
    return [];
  }
}

function savePosts(performanceId: string, kind: BoardKind, posts: BoardPost[]) {
  localStorage.setItem(storageKey(performanceId, kind), JSON.stringify(posts));
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

function getBoardMeta(kind: BoardKind) {
  switch (kind) {
    case "reviews":
      return {
        icon: "📝",
        description: "직접 관람한 후기를 공유해 주세요.",
        emptyTitle: "등록된 관람후기가 없습니다.",
        emptyHint: "첫 번째 관람후기를 작성해 보세요.",
      };
    case "expectations":
      return {
        icon: "💬",
        description: "관람 전 기대되는 포인트를 남겨 주세요.",
        emptyTitle: "등록된 기대평이 없습니다.",
        emptyHint: "첫 번째 기대평을 작성해 보세요.",
      };
    case "qa":
      return {
        icon: "❓",
        description: "궁금한 점을 질문하고, 정보를 공유해 주세요.",
        emptyTitle: "등록된 Q&A가 없습니다.",
        emptyHint: "첫 번째 질문을 작성해 보세요.",
      };
    default:
      return {
        icon: "🗂️",
        description: "게시글을 작성해 주세요.",
        emptyTitle: "등록된 글이 없습니다.",
        emptyHint: "첫 번째 글을 작성해 보세요.",
      };
  }
}

export default function BoardSection({ performanceId, kind, title }: Props) {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setToastVisible(true);
    const t = window.setTimeout(() => setToastVisible(false), 1800);
    const t2 = window.setTimeout(() => setToast(null), 2200);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [toast]);

  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPosts(loadPosts(performanceId, kind));
  }, [performanceId, kind]);

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [posts]);

  const meta = useMemo(() => getBoardMeta(kind), [kind]);

  const onCreate = (draft: { title: string; content: string }) => {
    const now = new Date().toISOString();
    const newPost: BoardPost = {
      id: `${performanceId}:${kind}:${now}`,
      kind,
      performanceId,
      title: draft.title.trim(),
      content: draft.content.trim(),
      createdAt: now,
    };

    const nextPosts = [newPost, ...posts];
    setPosts(nextPosts);
    savePosts(performanceId, kind, nextPosts);
    setOpen(false);
  };

  const onDelete = (id: string) => {
    const nextPosts = posts.filter((p) => p.id !== id);
    setPosts(nextPosts);
    savePosts(performanceId, kind, nextPosts);
  };

  const onClickWrite = () => {
    if (!isAuthed) {
      const message = "글 작성은 로그인 후 이용할 수 있습니다.";
      setToast(message);

      const from = `${location.pathname}${location.search}`;
      window.setTimeout(() => {
        navigate("/login", { state: { from: { pathname: from }, flash: message }, replace: false });
      }, 350);
      return;
    }
    setOpen(true);
  };

  return (
    <section className="sb-surface p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            <span aria-hidden="true">{meta.icon}</span>
            <span className="truncate">{title}</span>
          </h2>
          <p className="mt-1 text-sm sb-text-muted">{meta.description}</p>
          <p className="mt-1 text-xs sb-text-subtle">현재는 프론트 임시 저장(localStorage) 방식입니다.</p>
        </div>

        <button type="button" onClick={onClickWrite} className="sb-btn-primary shrink-0">
          작성하기
        </button>
      </header>

      <div className="mt-6">
        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-950/30">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{meta.emptyTitle}</p>
            <p className="mt-1 text-sm sb-text-muted">{meta.emptyHint}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sorted.map((p) => (
              <li key={p.id} className="rounded-2xl border border-slate-200 p-4 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">{p.title}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                      {p.content}
                    </p>
                    <p className="mt-2 text-xs sb-text-subtle">{formatDate(p.createdAt)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="sb-btn-outline h-9 shrink-0 px-3"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toast */}
      {toast && toastVisible ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-full bg-slate-900/95 px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
            {toast}
          </div>
        </div>
      ) : null}

      <WriteModal open={open} titleLabel={title} onClose={() => setOpen(false)} onSubmit={onCreate} />
    </section>
  );
}
