import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";

import Search from "../pages/Search";
import ConcertDetail from "../pages/ConcertDetail";
import Notice from "../pages/Notice";
import Favorites from "../pages/Favorites";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import MyPage from "../pages/MyPage";
import ForgotPassword from "../pages/ForgotPassword";
import RankingGenre from "../pages/RankingGenre";
import RankingRegion from "../pages/RankingRegion";
import Reserve from "../pages/Reserve";
import ReserveComplete from "../pages/ReserveComplete";
import RequireAuth from "./RequireAuth";

/**
 * ✅ 라우터
 * - "/"는 V1(Home)만 사용
 * - "/home-v1", "/home-v2"는 "/"로 리다이렉트
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: "home-v1", element: <Navigate to="/" replace /> },
      { path: "home-v2", element: <Navigate to="/" replace /> },

      { path: "search", element: <Search /> },
      { path: "ranking", element: <Navigate to="/ranking/genre" replace /> },
      { path: "ranking/genre", element: <RankingGenre /> },
      { path: "ranking/region", element: <RankingRegion /> },
      { path: "concert", element: <Navigate to="/search" replace /> },
      { path: "concerts/:id", element: <ConcertDetail /> },
      { path: "notice", element: <Notice /> },
      { path: "favorites", element: <Favorites /> },
      {
        path: "reserve/:id",
        element: (
          <RequireAuth>
            <Reserve />
          </RequireAuth>
        ),
      },
      {
        path: "reserve/complete",
        element: (
          <RequireAuth>
            <ReserveComplete />
          </RequireAuth>
        ),
      },

      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "signup", element: <Signup /> },
      {
        path: "mypage",
        element: (
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export { router };
export default router;
