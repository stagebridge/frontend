export default function NotificationIcon() {
  const loggedIn = false; // 추후 인증 연동 예정
  return (
    <button
      type="button"
      aria-label="알림"
      aria-disabled={!loggedIn}
      title={loggedIn ? "알림" : "로그인 후 이용 가능"}
      disabled={!loggedIn}
    >
      🔔
    </button>
  );
}
