import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthLinks() {
  const { user, isAuthed, logout } = useAuth();

  if (isAuthed && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[15px] text-slate-700 dark:text-slate-200">
          <strong>{user.nickname}</strong> 님 환영합니다
        </span>
        <button
          onClick={logout}
          className="rounded-lg border px-3 py-1.5 text-sm dark:border-neutral-700"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[15px]">
      <Link className="hover:underline" to="/login">로그인</Link>
      <span className="text-neutral-400">|</span>
      <Link className="hover:underline" to="/signup">회원가입</Link>
    </div>
  );
}
