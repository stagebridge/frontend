import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Concert from "../pages/Concert";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Notice from "../pages/Notice";
import SupportLayout from "../pages/support/SupportLayout";
import NoticeBoard from "../pages/support/NoticeBoard";
import FaqBoard from "../pages/support/FaqBoard";
import InquiryBoard from "../pages/support/InquiryBoard";
import MyPage from "../pages/MyPage";

// --- 레거시 경로 리다이렉트 헬퍼들 ---

// /concert/3 처럼 단수형 경로를 쓰는 옛주소 → /concerts/:id 로 보정
function LegacyConcertIdRedirect() {
  const { id } = useParams();
  return <Navigate to={`/concerts/${id ?? ""}`} replace />;
}

// /concert/cs-20250322 같은 슬러그형 옛주소 → /concerts/:id 로 보정
function LegacyConcertSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/concerts/${slug ?? ""}`} replace />;
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // 홈
      { index: true, element: <Home /> },

      // 정식 경로들
      { path: "/search", element: <Search /> },

      // /concerts 는 공연 목록/검색의 별칭으로 사용
      { path: "/concerts", element: <Navigate to="/search" replace /> },

      // ✅ 상세페이지: 카드 클릭 시 /concerts/:id → Concert (API 연동된 상세 페이지)
      { path: "/concerts/:id", element: <Concert /> },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/notice", element: <Notice /> },
      { path: "/mypage", element: <MyPage /> },

      // 고객지원
      {
        path: "/support",
        element: <SupportLayout />,
        children: [
          { index: true, element: <NoticeBoard /> },
          { path: "faq", element: <FaqBoard /> },
          { path: "inquiry", element: <InquiryBoard /> },
        ],
      },

      // --- 레거시/옛주소 Alias & Redirects ---

      // /me -> /mypage
      { path: "/me", element: <Navigate to="/mypage" replace /> },

      // /concert/3 처럼 단수형 사용 -> /concerts/:id 로
      { path: "/concert/:id", element: <LegacyConcertIdRedirect /> },

      // /concert/cs-20250322 같은 슬러그도 받아서 /concerts/:id 로
      { path: "/concert/:slug", element: <LegacyConcertSlugRedirect /> },

      // 그 외 전부 홈으로
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
