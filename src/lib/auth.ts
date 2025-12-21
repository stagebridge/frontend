// src/lib/auth.ts
export type User = { id: string; nickname: string; email?: string };
export type LoginDTO = { id: string; password: string };
export type SignupDTO = { id: string; password: string; email: string; nickname: string };

const TOKEN_KEY = "sb_token";
const AUTH_KEY = "sb_auth"; // { token, user }
const USERS_KEY = "sb_users"; // { [id]: User }
const USERS_PW_KEY = "sb_user_passwords"; // { [id]: string }

type AuthPayload = { token: string; user: User };

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function deriveNicknameFromId(id: string) {
  const safe = (id ?? "").trim();
  if (!safe) return "";
  if (isValidEmail(safe)) return safe.split("@")[0] || safe;
  return safe;
}

function normalizeUser(u: User): User {
  const id = (u.id ?? "").trim();
  const nicknameRaw = (u.nickname ?? "").trim();
  const emailRaw = (u.email ?? "").trim();

  const idLooksEmail = isValidEmail(id);

  // 1) email 보정: email이 비어 있으면 id가 이메일일 때 email에 채움
  const nextEmail = emailRaw || (idLooksEmail ? id : undefined);

  // 2) nickname 보정:
  // - nickname이 비어 있거나
  // - nickname이 id와 동일(레거시: 이메일을 nickname으로 사용한 상태)이고, id가 이메일이면
  //   -> @ 앞부분으로 표시용 닉네임 생성
  const nextNickname =
    !nicknameRaw || (nicknameRaw === id && idLooksEmail)
      ? deriveNicknameFromId(id)
      : nicknameRaw;

  return { id, nickname: nextNickname, ...(nextEmail ? { email: nextEmail } : {}) };
}

export async function login({ id, password }: LoginDTO): Promise<AuthPayload> {
  await delay(300);
  if (!id || !password) throw new Error("아이디와 비밀번호를 입력해 주세요.");

  const safeId = id.trim();

  const users = readUsers();
  const existing = users[safeId];

  // 레거시 데이터(비밀번호 미저장)가 존재할 수 있으므로,
  // 비밀번호가 저장되어 있는 경우에만 검증합니다.
  const passwords = readPasswords();
  const storedPw = passwords[safeId];
  if (storedPw && storedPw !== password) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  // ✅ 핵심: existing이 없거나, existing의 nickname/email이 레거시 형태면 normalize로 정리
  const baseUser: User =
    existing ?? {
      id: safeId,
      nickname: safeId, // normalizeUser에서 이메일이면 @ 앞부분으로 정리됨
      ...(isValidEmail(safeId) ? { email: safeId } : {}),
    };

  const user = normalizeUser(baseUser);

  // existing이 있으면, normalize된 값으로 USERS_KEY도 갱신(레거시 정리)
  if (existing) {
    users[safeId] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  const token = `mock.${btoa(safeId)}.${Date.now()}`;
  const payload: AuthPayload = { token, user };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export async function signup({ id, password, email, nickname }: SignupDTO): Promise<AuthPayload> {
  await delay(400);
  if (!id || !password || !email || !nickname) throw new Error("필수 항목을 모두 입력해 주세요.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("이메일 형식이 올바르지 않습니다.");

  const safeId = id.trim();

  const users = readUsers();
  if (users[safeId]) throw new Error("이미 존재하는 ID 입니다.");

  const user: User = normalizeUser({ id: safeId, nickname, email });
  users[safeId] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const passwords = readPasswords();
  passwords[safeId] = password;
  localStorage.setItem(USERS_PW_KEY, JSON.stringify(passwords));

  const token = `mock.${btoa(safeId)}.${Date.now()}`;
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
    const parsed = JSON.parse(raw) as AuthPayload;
    // AUTH_KEY에 남아 있는 레거시 user도 한번 정리
    return { ...parsed, user: normalizeUser(parsed.user) };
  } catch {
    return null;
  }
}

export async function updateCurrentUserProfile(patch: {
  nickname?: string;
  email?: string;
}): Promise<User> {
  await delay(250);
  const auth = getCurrentAuth();
  if (!auth?.user) throw new Error("로그인이 필요합니다.");

  const nextUserRaw: User = {
    ...auth.user,
    ...(patch.nickname !== undefined ? { nickname: patch.nickname } : {}),
    ...(patch.email !== undefined ? { email: patch.email } : {}),
  };

  const nextUser = normalizeUser(nextUserRaw);

  const users = readUsers();
  if (users[nextUser.id]) {
    users[nextUser.id] = nextUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  const payload: AuthPayload = { ...auth, user: nextUser };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return nextUser;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await delay(300);
  const auth = getCurrentAuth();
  if (!auth?.user) throw new Error("로그인이 필요합니다.");

  const passwords = readPasswords();
  const stored = passwords[auth.user.id];

  // 레거시 계정은 비밀번호가 없을 수 있으므로,
  // 저장된 비밀번호가 있을 때만 현재 비밀번호를 검증합니다.
  if (stored && stored !== input.currentPassword) {
    throw new Error("현재 비밀번호가 올바르지 않습니다.");
  }

  passwords[auth.user.id] = input.newPassword;
  localStorage.setItem(USERS_PW_KEY, JSON.stringify(passwords));
}

export async function deleteCurrentAccount(): Promise<void> {
  await delay(300);
  const auth = getCurrentAuth();
  if (!auth?.user) throw new Error("로그인이 필요합니다.");

  const id = auth.user.id;

  const users = readUsers();
  if (users[id]) {
    delete users[id];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  const passwords = readPasswords();
  if (passwords[id]) {
    delete passwords[id];
    localStorage.setItem(USERS_PW_KEY, JSON.stringify(passwords));
  }

  logout();
}

function readUsers(): Record<string, User> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function readPasswords(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(USERS_PW_KEY) || "{}");
  } catch {
    return {};
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
