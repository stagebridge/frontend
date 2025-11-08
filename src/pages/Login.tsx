// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [id, setId] = useState("");
  const [password, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login({ id, password });
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-center text-5xl font-black tracking-tight">StageBridge</h1>
      <form onSubmit={onSubmit} className="mx-auto max-w-xl rounded-2xl border p-8 shadow-sm dark:border-neutral-800">
        <label className="mb-2 block text-sm font-medium">ID</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />

        <label className="mb-2 mt-2 block text-sm font-medium">Password</label>
        <div className="mb-4 flex items-stretch gap-2">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="shrink-0 rounded-lg border px-3 text-sm dark:border-neutral-700">
            {showPw ? "숨김" : "표시"}
          </button>
        </div>

        {err && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{err}</p>}

        <button disabled={loading} className="mt-2 w-full rounded-lg bg-black py-3 text-white hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">
          {loading ? "로그인 중..." : "Login"}
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="#" className="text-neutral-600 underline hover:text-neutral-900 dark:text-neutral-300">Forgot password?</Link>
          <Link to="/signup" className="font-medium underline">Sign Up!</Link>
        </div>
      </form>
    </main>
  );
}
