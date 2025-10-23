import { Link } from "react-router-dom";

export default function AuthLinks() {
  return (
    <div>
      <Link to="/login">로그인</Link>
      {" | "}
      <Link to="/signup">회원가입</Link>
    </div>
  );
}
