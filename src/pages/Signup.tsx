import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const safeId = id.trim();
    const safeEmail = email.trim();
    const safeNickname = nickname.trim();

    if (!safeId || !safeEmail || !safeNickname || !password) {
      setError("아이디, 이메일, 닉네임, 비밀번호를 입력해 주세요.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(safeEmail)) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (safeNickname.length < 2 || safeNickname.length > 15) {
      setError("닉네임은 2~15 글자 내외로 입력해 주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 여덟 글자 이상으로 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);

      await signup({ id: safeId, email: safeEmail, nickname: safeNickname, password });

      // 가입 직후 자동 로그인 상태가 되므로, 마이페이지로 이동
      navigate("/mypage", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="sb-surface p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          회원가입
        </h1>
        <p className="mt-1 text-sm sb-text-muted">기본 정보를 입력해 계정을 생성합니다.</p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-semibold sb-text-muted" htmlFor="signup-id">
              아이디
            </label>
            <input
              id="signup-id"
              type="text"
              className="sb-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="user123"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold sb-text-muted" htmlFor="signup-email">
              이메일
            </label>
            <input
              id="signup-email"
              type="email"
              className="sb-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold sb-text-muted" htmlFor="signup-nickname">
              닉네임
            </label>
            <input
              id="signup-nickname"
              type="text"
              className="sb-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              autoComplete="nickname"
            />
            <p className="mt-2 text-xs sb-text-subtle">2~15 글자 내외, 공백 없이 권장합니다.</p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold sb-text-muted" htmlFor="signup-password">
              비밀번호
            </label>
            <input
              id="signup-password"
              type="password"
              className="sb-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 (여덟 글자 이상)"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="sb-btn-primary w-full" disabled={submitting}>
            {submitting ? "가입 중" : "회원가입"}
          </button>

          <div className="text-sm sb-text-muted">
            이미 계정이 있으신가요?{" "}
            <Link className="font-semibold hover:underline" to="/login">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
