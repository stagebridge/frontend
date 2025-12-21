import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function AuthLinks() {
  const { user, isAuthed, logout } = useAuth();
  const { t } = useTranslation();

  if (isAuthed && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[15px] text-slate-700 dark:text-slate-200">
          <strong>{user.nickname}</strong> {t("common.welcomeSuffix")}
        </span>
        <button
          onClick={logout}
          className="rounded-lg border px-3 py-1.5 text-sm dark:border-neutral-700"
        >
          {t("common.logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[15px]">
      <Link className="hover:underline" to="/login">{t("common.login")}</Link>
      <span className="text-neutral-400">|</span>
      <Link className="hover:underline" to="/signup">{t("common.signup")}</Link>
    </div>
  );
}
