// src/app/http.ts
import axios from "axios";

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

export default http;
