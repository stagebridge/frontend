// src/pages/mypage/ProfileOverview.tsx
import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileOverview() {
  const { user, isAuthed } = useAuth();

  const summary = useMemo(() => {
    if (!isAuthed || !user) {
      return {
        title: "게스트",
        email: "로그인이 필요합니다.",
      };
    }
    return {
      title: user.nickname,
      email: user.email ?? "(이메일 미등록)",
    };
  }, [isAuthed, user]);

  return (
    <div className="space-y-4">
      <div className="sb-surface-soft p-4">
        <p className="text-xs font-semibold sb-text-muted">내 계정</p>
        <div className="mt-3 space-y-1">
          <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {summary.title}
          </p>
          <p className="text-sm sb-text-muted">{summary.email}</p>
        </div>
      </div>

      <div className="text-sm sb-text-muted">
        "개인정보 수정"에서 닉네임, 비밀번호, 언어, 알림, 그리고 회원 탈퇴를 관리할 수 있습니다.
      </div>
    </div>
  );
}
