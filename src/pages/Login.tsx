import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

type LocationState = { from?: { pathname?: string } };

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flash = (location.state as unknown as { flash?: string } | null)?.flash;
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!flash) return;
    setToast(flash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    setToastVisible(true);
    const t = window.setTimeout(() => setToastVisible(false), 1800);
    const t2 = window.setTimeout(() => setToast(null), 2200);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [toast]);

  const from =
    (location.state as LocationState | null)?.from?.pathname ?? "/mypage";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const safeId = loginId.trim();
    if (!safeId || !password) {
      setError(t("ui.login.errors.required"));
      return;
    }

    try {
      setSubmitting(true);
      await login({ id: safeId, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("ui.login.errors.failed");
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-100 px-4 py-14 dark:bg-slate-950">
      <section className="mx-auto w-full max-w-[380px] rounded-[22px] border border-slate-200/90 bg-white/95 p-7 shadow-[0_14px_38px_rgba(15,23,42,0.1)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-[0_14px_38px_rgba(2,6,23,0.7)]">
        <h1 className="text-center text-[32px] font-semibold leading-none tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          {t("ui.login.title")}
        </h1>
        <p className="mt-4 text-center text-[13px] text-slate-600 dark:text-slate-300">
          {t("ui.login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700/60"
            placeholder={t("ui.login.id")}
            autoComplete="username"
            aria-label={t("ui.login.id")}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700/60"
            placeholder={t("ui.login.password")}
            autoComplete="current-password"
            aria-label={t("ui.login.password")}
          />

          <div className="flex items-center justify-end text-[11px] text-slate-500 dark:text-slate-400">
            <Link to="/forgot-password" className="hover:text-slate-700 dark:hover:text-slate-200">
              {t("ui.login.forgotPassword")}
            </Link>
          </div>

          {error ? (
            <p className="text-center text-xs text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-11 w-full rounded-xl bg-slate-800 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {submitting ? t("ui.login.submitting") : t("ui.login.submit")}
          </button>

          <p className="pt-3 text-center text-sm text-slate-500 dark:text-slate-400">
            {t("ui.login.noAccount")}{" "}
            <Link to="/signup" className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-100">
              {t("ui.login.createAccount")}
            </Link>
          </p>
        </form>
      </section>

      {toast && toastVisible ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-full bg-slate-900/95 px-4 py-2 text-sm font-semibold text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
            {toast}
          </div>
        </div>
      ) : null}
    </main>
  );
}
