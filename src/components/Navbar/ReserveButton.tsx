import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ReserveButton() {
  const nav = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => nav({ pathname: "/search", search: "?page=1" })}
      aria-label={t("navbar.goReserveAria")}
    >
      {t("common.reserve")}
    </button>
  );
}
