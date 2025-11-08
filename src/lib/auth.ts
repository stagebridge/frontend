// src/lib/auth.ts
export type User = { id: string; nickname: string; email?: string };
export type LoginDTO = { id: string; password: string };
export type SignupDTO = { id: string; password: string; email: string; nickname: string };

const TOKEN_KEY = "sb_token";
const AUTH_KEY = "sb_auth";     // { token, user }
const USERS_KEY = "sb_users";   // 간단한 mock 사용자 DB

type AuthPayload = { token: string; user: User };

export async function login({ id, password }: LoginDTO): Promise<AuthPayload> {
  await delay(400);
  if (!id || !password) throw new Error("아이디와 비밀번호를 입력해 주세요.");

  const users = readUsers();
  const existing = users[id];
  const user: User = existing ?? { id, nickname: id }; // 미등록이면 임시 닉네임=id

  const token = `mock.${btoa(id)}.${Date.now()}`;
  const payload: AuthPayload = { token, user };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export async function signup({ id, password, email, nickname }: SignupDTO): Promise<AuthPayload> {
  await delay(500);
  if (!id || !password || !email || !nickname) throw new Error("필수 항목을 모두 입력해 주세요.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("이메일 형식이 올바르지 않습니다.");

  // 간단한 중복 ID 체크
  const users = readUsers();
  if (users[id]) throw new Error("이미 존재하는 ID 입니다.");

  const user: User = { id, nickname, email };
  users[id] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const token = `mock.${btoa(id)}.${Date.now()}`;
  const payload: AuthPayload = { token, user };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentAuth(): AuthPayload | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

function readUsers(): Record<string, User> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
