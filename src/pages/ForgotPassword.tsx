import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-20">
      <h1 className="mb-6 text-3xl font-bold">비밀번호 찾기</h1>

      {submitted ? (
        <div className="rounded-2xl border p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            입력하신 이메일로 비밀번호 재설정 안내를 전송했습니다.
          </p>
          <div className="mt-4 text-sm">
            <Link to="/login" className="underline">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-6 dark:border-neutral-800"
        >
          <label className="mb-2 block text-sm font-medium">이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="example@email.com"
          />

          <button className="w-full rounded-lg bg-black py-3 text-white dark:bg-white dark:text-black">
            이메일 전송
          </button>

          <div className="mt-6 text-sm">
            <Link to="/login" className="underline">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
