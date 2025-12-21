import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import App from "../App";

import Home from "../pages/Home";
import Search from "../pages/Search";
import Concert from "../pages/Concert";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Notice from "../pages/Notice";

import SupportLayout from "../pages/support/SupportLayout";
import NoticeBoard from "../pages/support/NoticeBoard";
import FaqBoard from "../pages/support/FaqBoard";
import InquiryBoard from "../pages/support/InquiryBoard";

import MyPage from "../pages/MyPage";
import RequireAuth from "./RequireAuth";

import Reserve from "../pages/Reserve";
import ReserveComplete from "../pages/ReserveComplete";

/**
 * 레거시 URL 리다이렉트
 * - /concert/:id -> /concerts/:id
 * - /concert/:slug -> /concerts/:slug
 */
function LegacyConcertIdRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/concerts/${id ?? ""}`} replace />;
}

function LegacyConcertSlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/concerts/${slug ?? ""}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // 검색/목록
      { path: "search", element: <Search /> },

      // 공연 상세 (현재 카드 링크가 /concerts/:id 로 가는 구조)
      { path: "concerts/:id", element: <Concert /> },

      // 인증
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },

      // 공지
      { path: "notice", element: <Notice /> },

      // 마이페이지 (보호 라우트)
      {
        path: "mypage",
        element: (
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        ),
      },
      { path: "me", element: <Navigate to="/mypage" replace /> },

      // 고객센터
      {
        path: "support",
        element: <SupportLayout />,
        children: [
          { index: true, element: <NoticeBoard /> },
          { path: "faq", element: <FaqBoard /> },
          { path: "inquiry", element: <InquiryBoard /> },
        ],
      },

      // 예매
      { path: "reserve/:id", element: <Reserve /> },
      { path: "reserve/complete", element: <ReserveComplete /> },

      // 레거시 경로
      { path: "concert/:id", element: <LegacyConcertIdRedirect /> },
      { path: "concert/:slug", element: <LegacyConcertSlugRedirect /> },

      // ✅ 반드시 맨 마지막
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
