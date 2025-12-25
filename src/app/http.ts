// src/app/http.ts
import axios from "axios";

// src/lib/auth.ts 와 키를 맞춰야 합니다.
const TOKEN_KEY = "sb_token";

/**
 * ✅ VITE_API_BASE 권장 형식:
 * - 개발: http://localhost:3000/api
 * - 운영: https://api.stagebridge.com/api (예시)
 *
 * .env.local 에 다음처럼 두는 것을 권장합니다.
 * VITE_API_BASE=http://localhost:3000/api
 */
const baseURL =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "http://localhost:3000/api";

const http = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Authorization 헤더 자동 주입
 * - /api/auth/login 성공 시 저장한 accessToken(sb_token)을 요청마다 Bearer로 첨부합니다.
 */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ✅ 토큰 만료/인증 실패(401) 시 토큰 제거
 * - 화면 전환은 AuthContext에서 처리하도록, 여기서는 저장소 정리만 수행합니다.
 */
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("sb_auth");
    }
    return Promise.reject(err);
  },
);

export default http;
