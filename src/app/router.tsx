import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";

import Search from "../pages/Search";
import ConcertDetail from "../pages/ConcertDetail";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import MyPage from "../pages/MyPage";

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
      { path: "concerts/:id", element: <ConcertDetail /> },

      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
]);

export { router };
export default router;
