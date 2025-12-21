import {
  type ListSupportPostsParams,
  type ListSupportPostsResult,
  type SupportBoardKind,
  type SupportPost,
  type SupportPostStatus,
} from "../types/support";

// NOTE: 고객센터 게시판은 백엔드 연동 전까지 localStorage 기반으로 동작합니다.
//       백엔드 연결 시 이 파일만 교체하면 됩니다.

function storageKey(kind: SupportBoardKind) {
  return `sb_support_${kind}`;
}

function readAll(kind: SupportBoardKind): SupportPost[] {
  const raw = localStorage.getItem(storageKey(kind));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SupportPost[]) : [];
  } catch {
    return [];
  }
}

function writeAll(kind: SupportBoardKind, items: SupportPost[]) {
  localStorage.setItem(storageKey(kind), JSON.stringify(items));
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function sortLatest(posts: SupportPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listSupportPosts(
  params: ListSupportPostsParams,
): Promise<ListSupportPostsResult> {
  const { kind, page, size, q } = params;

  const all = readAll(kind);
  const keyword = q ? normalize(q) : "";

  const filtered = keyword
    ? all.filter((p) => {
        const t = normalize(p.title);
        const c = normalize(p.content);
        return t.includes(keyword) || c.includes(keyword);
      })
    : all;

  const sorted = sortLatest(filtered);
  const total = sorted.length;
  const start = (page - 1) * size;
  const end = start + size;

  return { items: sorted.slice(start, end), total, page, size };
}

export async function createSupportPost(input: {
  kind: SupportBoardKind;
  title: string;
  content: string;
  status?: SupportPostStatus;
}): Promise<SupportPost> {
  const { kind, title, content, status } = input;
  const all = readAll(kind);
  const now = new Date().toISOString();

  const post: SupportPost = {
    id: makeId(),
    kind,
    title: title.trim(),
    content: content.trim(),
    createdAt: now,
    ...(kind === "inquiry" ? { status: status ?? "접수" } : {}),
  };

  writeAll(kind, [post, ...all]);
  return post;
}

export async function updateSupportPost(input: {
  kind: SupportBoardKind;
  id: string;
  title: string;
  content: string;
  status?: SupportPostStatus;
}): Promise<SupportPost | null> {
  const { kind, id, title, content, status } = input;
  const all = readAll(kind);
  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const updated: SupportPost = {
    ...all[idx],
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString(),
    ...(kind === "inquiry" && status ? { status } : {}),
  };

  const next = [...all];
  next[idx] = updated;
  writeAll(kind, next);
  return updated;
}

export async function deleteSupportPost(input: {
  kind: SupportBoardKind;
  id: string;
}): Promise<boolean> {
  const { kind, id } = input;
  const all = readAll(kind);
  const next = all.filter((p) => p.id !== id);
  writeAll(kind, next);
  return next.length !== all.length;
}

export async function getSupportPost(input: {
  kind: SupportBoardKind;
  id: string;
}): Promise<SupportPost | null> {
  const { kind, id } = input;
  const all = readAll(kind);
  return all.find((p) => p.id === id) ?? null;
}
