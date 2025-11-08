import LanguageButton from "./LanguageButton";
import ThemeToggle from "./ThemeToggle";
import NotificationIcon from "./NotificationIcon";
import AuthLinks from "./AuthLinks";
import ReserveButton from "./ReserveButton";

export default function Actions() {
  return (
    <div className="flex items-center gap-3" aria-label="오른쪽 액션 영역">
      <LanguageButton />
      <ThemeToggle />
      <NotificationIcon />
      <AuthLinks />
      <ReserveButton />
    </div>
  );
}
