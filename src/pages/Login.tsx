import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type LocationState = { from?: { pathname?: string } };

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as LocationState | null)?.from?.pathname ?? "/mypage";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const safeEmail = email.trim();
    if (!safeEmail || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // AuthContext(login) 시그니처는 { id, password } 입니다.
      // 현재 로그인 폼은 이메일 입력을 사용하므로, 이메일을 id로 매핑합니다.
      await login({ id: safeEmail, password });

      // RequireAuth가 남긴 목적지로 복귀(없으면 /mypage)
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-2 text-sm text-gray-500">
        StageBridge 계정으로 로그인합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">이메일</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="example@stagebridge.com"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-sm font-medium">비밀번호</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="비밀번호를 입력해 주세요."
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="h-5" />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-sm text-gray-600">
          아직 계정이 없으신가요?{" "}
          <Link to="/signup" className="font-medium underline">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
