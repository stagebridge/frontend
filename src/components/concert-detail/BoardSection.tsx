import { useEffect, useMemo, useState } from "react";
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
  return `stagebridge.board.${kind}.${performanceId}`;
}

function loadPosts(performanceId: string, kind: BoardKind): BoardPost[] {
  try {
    const raw = localStorage.getItem(storageKey(performanceId, kind));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BoardPost[];
    return Array.isArray(parsed) ? parsed : [];
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

export default function BoardSection({ performanceId, kind, title }: Props) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPosts(loadPosts(performanceId, kind));
  }, [performanceId, kind]);

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [posts]);

  const onCreate = (payload: { title: string; content: string }) => {
    const next: BoardPost = {
      id: crypto.randomUUID(),
      kind,
      performanceId,
      title: payload.title.trim(),
      content: payload.content.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextPosts = [next, ...posts];
    setPosts(nextPosts);
    savePosts(performanceId, kind, nextPosts);
    setOpen(false);
  };

  const onDelete = (id: string) => {
    const nextPosts = posts.filter((p) => p.id !== id);
    setPosts(nextPosts);
    savePosts(performanceId, kind, nextPosts);
  };

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-xs text-gray-500">
            현재는 프론트 임시 저장(localStorage) 방식입니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-9 rounded-xl bg-black px-4 text-sm font-semibold text-white"
        >
          작성하기
        </button>
      </div>

      <div className="mt-6">
        {sorted.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 p-5 text-sm text-gray-600">
            등록된 글이 없습니다.
          </div>
        ) : (
          <ul className="space-y-3">
            {sorted.map((p) => (
              <li key={p.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{p.content}</p>
                    <p className="mt-2 text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="shrink-0 rounded-lg border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <WriteModal
        open={open}
        titleLabel={title}
        onClose={() => setOpen(false)}
        onSubmit={onCreate}
      />
    </div>
  );
}
