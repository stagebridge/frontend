import {
  type BoardKind,
  type BoardPost,
  type BoardSort,
  type ListBoardPostsParams,
  type ListBoardPostsResult,
} from "../types/board";

// NOTE: 백엔드 API가 준비되기 전까지 사용하는 프론트 전용 임시 저장소입니다.
//       (localStorage 기반) 백엔드 연결 시 이 파일만 교체하면 됩니다.

function storageKey(performanceId: string, kind: BoardKind) {
  return `sb_board_${performanceId}_${kind}`;
}

function readAll(performanceId: string, kind: BoardKind): BoardPost[] {
  const raw = localStorage.getItem(storageKey(performanceId, kind));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BoardPost[]) : [];
  } catch {
    return [];
  }
}

function writeAll(performanceId: string, kind: BoardKind, items: BoardPost[]) {
  localStorage.setItem(storageKey(performanceId, kind), JSON.stringify(items));
}

function makeId() {
  // 충돌 가능성을 낮춘 간단 ID
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function sortPosts(posts: BoardPost[], sort: BoardSort): BoardPost[] {
  const copied = [...posts];
  if (sort === "popular") {
    copied.sort((a, b) => {
      // like 우선, 그다음 최신
      if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return copied;
  }
  copied.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return copied;
}

export async function listBoardPosts(params: ListBoardPostsParams): Promise<ListBoardPostsResult> {
  const { performanceId, kind, page, size, q, sort = "latest" } = params;

  const all = readAll(performanceId, kind);
  const keyword = q ? normalize(q) : "";

  const filtered = keyword
    ? all.filter((p) => {
        const t = normalize(p.title);
        const c = normalize(p.content);
        const a = normalize(p.author);
        return t.includes(keyword) || c.includes(keyword) || a.includes(keyword);
      })
    : all;

  const sorted = sortPosts(filtered, sort);

  const total = sorted.length;
  const start = (page - 1) * size;
  const end = start + size;
  const items = sorted.slice(start, end);

  return { items, total, page, size };
}

export async function createBoardPost(input: {
  performanceId: string;
  kind: BoardKind;
  title: string;
  content: string;
  author: string;
}): Promise<BoardPost> {
  const { performanceId, kind, title, content, author } = input;

  const all = readAll(performanceId, kind);
  const now = new Date().toISOString();

  const post: BoardPost = {
    id: makeId(),
    performanceId,
    kind,
    title: title.trim(),
    content: content.trim(),
    author: author.trim() || "익명",
    createdAt: now,
    likeCount: 0,
    viewCount: 0,
  };

  writeAll(performanceId, kind, [post, ...all]);
  return post;
}

export async function updateBoardPost(input: {
  performanceId: string;
  kind: BoardKind;
  id: string;
  title: string;
  content: string;
}): Promise<BoardPost | null> {
  const { performanceId, kind, id, title, content } = input;
  const all = readAll(performanceId, kind);

  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const updated: BoardPost = {
    ...all[idx],
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString(),
  };

  const next = [...all];
  next[idx] = updated;
  writeAll(performanceId, kind, next);
  return updated;
}

export async function deleteBoardPost(input: {
  performanceId: string;
  kind: BoardKind;
  id: string;
}): Promise<boolean> {
  const { performanceId, kind, id } = input;
  const all = readAll(performanceId, kind);
  const next = all.filter((p) => p.id !== id);
  writeAll(performanceId, kind, next);
  return next.length !== all.length;
}

export async function likeBoardPost(input: {
  performanceId: string;
  kind: BoardKind;
  id: string;
}): Promise<BoardPost | null> {
  const { performanceId, kind, id } = input;
  const all = readAll(performanceId, kind);

  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const updated: BoardPost = { ...all[idx], likeCount: all[idx].likeCount + 1 };
  const next = [...all];
  next[idx] = updated;
  writeAll(performanceId, kind, next);
  return updated;
}

export async function readBoardPost(input: {
  performanceId: string;
  kind: BoardKind;
  id: string;
}): Promise<BoardPost | null> {
  const { performanceId, kind, id } = input;
  const all = readAll(performanceId, kind);

  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const updated: BoardPost = { ...all[idx], viewCount: all[idx].viewCount + 1 };
  const next = [...all];
  next[idx] = updated;
  writeAll(performanceId, kind, next);

  return updated;
}
