// src/lib/auth.ts
import http from "../app/http";

export type User = {
  id: string;
  nickname: string;
  email?: string;
  uuid?: string;
};

export type LoginDTO = { id: string; password: string };
export type SignupDTO = { id: string; password: string; email: string; nickname: string };

const TOKEN_KEY = "sb_token";
const AUTH_KEY = "sb_auth"; // { token, user }

type AuthPayload = { token: string; user: User };

type ApiEnvelope<T> = { message?: string; data: T };

type ApiUser = {
  uuid?: string;
  id: string;
  nickname: string;
  email?: string | null;
};

type LoginResponseData = {
  accessToken: string;
  user: ApiUser;
};

function toUser(u: ApiUser): User {
  return {
    id: (u.id ?? "").trim(),
    nickname: (u.nickname ?? "").trim(),
    ...(u.email ? { email: String(u.email).trim() } : {}),
    ...(u.uuid ? { uuid: String(u.uuid).trim() } : {}),
  };
}

function writeAuth(payload: AuthPayload) {
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentAuth(): AuthPayload | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(AUTH_KEY);
  if (!token || !raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthPayload;
    if (!parsed?.user) return null;
    return { token, user: parsed.user };
  } catch {
    return null;
  }
}

/**
 * ✅ 로그인
 * POST /api/auth/login
 */
export async function login(dto: LoginDTO): Promise<AuthPayload> {
  const safeId = dto.id.trim();
  if (!safeId || !dto.password) throw new Error("아이디와 비밀번호를 입력해 주세요.");

  try {
    const res = await http.post<ApiEnvelope<LoginResponseData>>("/auth/login", {
      id: safeId,
      password: dto.password,
    });

    const token = res.data?.data?.accessToken;
    const user = res.data?.data?.user;
    if (!token || !user) throw new Error("로그인 응답 형식이 올바르지 않습니다.");

    const payload: AuthPayload = { token, user: toUser(user) };
    writeAuth(payload);
    return payload;
  } catch (err: unknown) {
    throw normalizeApiError(err, "로그인에 실패했습니다.");
  }
}

/**
 * ✅ 회원가입
 * POST /api/auth/signup
 *
 * - 백엔드 구현에 따라 accessToken을 돌려주지 않을 수 있으므로,
 *   가입 성공 후 바로 login을 호출해 “가입 직후 자동 로그인” UX를 유지합니다.
 */
export async function signup(dto: SignupDTO): Promise<AuthPayload> {
  const safeId = dto.id.trim();
  const safeEmail = dto.email.trim();
  const safeNickname = dto.nickname.trim();

  if (!safeId || !dto.password || !safeEmail || !safeNickname) {
    throw new Error("필수 항목을 모두 입력해 주세요.");
  }

  try {
    await http.post<ApiEnvelope<ApiUser>>("/auth/signup", {
      id: safeId,
      password: dto.password,
      nickname: safeNickname,
      email: safeEmail,
    });

    // ✅ 가입 직후 자동 로그인
    return await login({ id: safeId, password: dto.password });
  } catch (err: unknown) {
    throw normalizeApiError(err, "회원가입에 실패했습니다.");
  }
}

/**
 * ✅ 현재 사용자 조회
 * GET /api/auth/me
 */
export async function fetchMe(): Promise<User> {
  try {
    const res = await http.get<ApiEnvelope<ApiUser>>("/auth/me");
    const apiUser = res.data?.data;
    if (!apiUser?.id || !apiUser?.nickname) {
      throw new Error("사용자 정보 응답 형식이 올바르지 않습니다.");
    }

    const user = toUser(apiUser);

    const current = getCurrentAuth();
    if (current?.token) {
      writeAuth({ token: current.token, user });
    }

    return user;
  } catch (err: unknown) {
    throw normalizeApiError(err, "사용자 정보를 불러오지 못했습니다.");
  }
}

/**
 * ⚠️ 프로필 업데이트/비밀번호 변경/계정 삭제 API는 Swagger에 노출되지 않았습니다.
 * - 프론트에서 기능 호출이 발생하지 않도록, 최소한의 로컬 갱신만 제공합니다.
 * - 백엔드 엔드포인트가 준비되면 이 함수들을 서버 호출로 교체하십시오.
 */
export async function updateCurrentUserProfile(patch: {
  nickname?: string;
  email?: string;
}): Promise<User> {
  const auth = getCurrentAuth();
  if (!auth?.user) throw new Error("로그인이 필요합니다.");

  const nextUser: User = {
    ...auth.user,
    ...(patch.nickname !== undefined ? { nickname: patch.nickname.trim() } : {}),
    ...(patch.email !== undefined ? { email: patch.email.trim() } : {}),
  };

  writeAuth({ token: auth.token, user: nextUser });
  return nextUser;
}

export async function changePassword(_input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  throw new Error("현재 서버에서 비밀번호 변경 API가 제공되지 않습니다.");
}

export async function deleteCurrentAccount(): Promise<void> {
  throw new Error("현재 서버에서 계정 삭제 API가 제공되지 않습니다.");
}

function normalizeApiError(err: unknown, fallback: string): Error {
  // axios 에러 구조를 느슨하게 처리합니다.
  const anyErr = err as { response?: { data?: unknown; status?: number }; message?: string };
  const status = anyErr?.response?.status;
  const data = anyErr?.response?.data as any;

  const serverMsg =
    typeof data?.message === "string"
      ? data.message
      : typeof data === "string"
        ? data
        : null;

  if (status === 401) return new Error(serverMsg || "아이디 또는 비밀번호가 올바르지 않습니다.");
  if (status === 409) return new Error(serverMsg || "이미 존재하는 ID 입니다.");
  return new Error(serverMsg || anyErr?.message || fallback);
}
