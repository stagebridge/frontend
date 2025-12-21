// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

// 다크모드 초기화 (렌더 이전에 수행)
(() => {
  const saved = localStorage.getItem("sb_theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
})();

// React Query 클라이언트
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // UX 기본값 (필요 시 조정)
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30, // 30s
    },
  },
});

// 선택: API 베이스 경고 (환경변수 누락 시 한 번만 경고)
if (!import.meta.env.VITE_API_BASE) {
  // eslint-disable-next-line no-console
  console.warn(
    "[StageBridge] VITE_API_BASE 미설정: 기본값(http://localhost:3000/api)로 동작합니다."
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
