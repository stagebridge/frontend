import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BrandLink() {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className="flex items-center gap-2"
      aria-label={t("ui.nav.brandHomeAria")}
    >
      <span className="sb-logo-float text-[24px] font-extrabold leading-none tracking-tight">
        <span className="text-sky-600">Stage</span>
        <span className="text-slate-900 dark:text-slate-100">Bridge</span>
      </span>
    </Link>
  );
}
