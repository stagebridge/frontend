// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { signup } = useAuth();

  const [id, setId] = useState("");
  const [password, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!id.trim()) return setErr("ID를 입력해 주세요.");
    if (password.length < 6) return setErr("비밀번호는 6자 이상이어야 합니다.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("이메일 형식이 올바르지 않습니다.");
    if (!nickname.trim()) return setErr("닉네임을 입력해 주세요.");

    setLoading(true);
    try {
      await signup({ id, password, email, nickname });
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-10 text-center text-5xl font-black tracking-tight">StageBridge</h1>
      <form onSubmit={onSubmit} className="mx-auto max-w-xl rounded-2xl border p-8 shadow-sm dark:border-neutral-800">
        <h2 className="mb-6 text-xl font-semibold">Create Account</h2>

        <label className="mb-2 block text-sm font-medium">ID</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디"
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />

        <label className="mb-2 mt-2 block text-sm font-medium">Password</label>
        <div className="mb-4 flex items-stretch gap-2">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호(6자 이상)"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="shrink-0 rounded-lg border px-3 text-sm dark:border-neutral-700">
            {showPw ? "숨김" : "표시"}
          </button>
        </div>

        <label className="mb-2 mt-2 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="SB@email.com"
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />

        <label className="mb-2 mt-2 block text-sm font-medium">Nickname</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="표시될 닉네임"
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />

        {err && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{err}</p>}

        <button disabled={loading} className="mt-2 w-full rounded-lg bg-black py-3 text-white hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">
          {loading ? "가입 중..." : "Sign In"}
        </button>

        <div className="mt-4 text-right text-sm">
          <Link to="/login" className="underline">이미 계정이 있으신가요? Login</Link>
        </div>
      </form>
    </main>
  );
}
