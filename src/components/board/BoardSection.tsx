import { useEffect, useMemo, useState } from "react";

export type BoardKind = "reviews" | "expectations" | "qa";

export type BoardPost = {
  id: string;
  performanceId: string;
  kind: BoardKind;
  title: string;
  content: string;
  createdAt: string; // ISO string
};

type Props = {
  performanceId: string;
  kind: BoardKind;
  title: string; // 섹션 제목(관람후기/기대평/Q&A)
};

function makeKey(performanceId: string, kind: BoardKind) {
  return `stagebridge.board.${performanceId}.${kind}`;
}

function safeUUID() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function BoardSection({ performanceId, kind, title }: Props) {
  const storageKey = useMemo(() => makeKey(performanceId, kind), [performanceId, kind]);

  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState<string | null>(null);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as BoardPost[]) : [];
      setPosts(Array.isArray(parsed) ? parsed : []);
    } catch {
      setPosts([]);
    }
  }, [storageKey]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [storageKey, posts]);

  const submit = () => {
    setError(null);

    const t = form.title.trim();
    const c = form.content.trim();

    if (!t) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!c) {
      setError("내용을 입력해 주세요.");
      return;
    }

    const next: BoardPost = {
      id: safeUUID(),
      performanceId,
      kind,
      title: t,
      content: c,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [next, ...prev]);
    setForm({ title: "", content: "" });
    setIsWriting(false);
  };

  const remove = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        <button
          type="button"
          onClick={() => setIsWriting((v) => !v)}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          {isWriting ? "닫기" : "작성"}
        </button>
      </div>

      {isWriting ? (
        <div className="mt-4 rounded-xl border bg-gray-50 p-4">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">제목</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
                placeholder="제목을 입력해 주세요."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">내용</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                className="min-h-[120px] w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
                placeholder="내용을 입력해 주세요."
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsWriting(false);
                  setError(null);
                }}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submit}
                className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:opacity-90"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-500">
            등록된 글이 없습니다.
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{p.title}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                      {p.content}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="shrink-0 rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
