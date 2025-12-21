import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type RequireAuthProps = {
  children: ReactNode;
  redirectTo?: string;
};

/**
 * 인증이 필요한 라우트를 보호합니다.
 * - 미로그인: /login 으로 이동(원래 목적지는 state.from 으로 저장)
 * - 로그인: children 렌더
 */
export default function RequireAuth({ children, redirectTo = "/login" }: RequireAuthProps) {
  const location = useLocation();
  const { isAuthed } = useAuth();

  if (!isAuthed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
