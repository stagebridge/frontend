import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationIcon() {
  const [count] = useState(3); // 목데이터
  const loggedIn = true; // 추후 인증 연동
  const navigate = useNavigate();

  // 클릭 시 /notice로 이동
  const handleClick = () => {
    if (!loggedIn) return alert("로그인 후 이용 가능합니다.");
    navigate("/notice");
  };

  return (
    <button
      type="button"
      aria-label="공지사항"
      title={loggedIn ? "공지사항" : "로그인 후 이용 가능"}
      className="relative text-xl"
      onClick={handleClick}
      disabled={!loggedIn}
    >
      🔔
      {loggedIn && count > 0 && (
        <span
          className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-[10px] text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}
