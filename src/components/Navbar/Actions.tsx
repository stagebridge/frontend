import LanguageButton from "./LanguageButton";
import ThemeToggle from "./ThemeToggle";
import NotificationIcon from "./NotificationIcon";
import AuthLinks from "./AuthLinks";
import ReserveButton from "./ReserveButton";
import { useTranslation } from "react-i18next";

export default function Actions() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3" aria-label={t("navbar.actionsAria")}>
      <LanguageButton />
      <ThemeToggle />
      <NotificationIcon />
      <AuthLinks />
      <ReserveButton />
    </div>
  );
}
