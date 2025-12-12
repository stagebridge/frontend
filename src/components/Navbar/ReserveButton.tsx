import { useNavigate } from "react-router-dom";

export default function ReserveButton() {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav({ pathname: "/search", search: "?page=1" })}
      aria-label="예매 페이지로 이동"
    >
      예매하기
    </button>
  );
}
