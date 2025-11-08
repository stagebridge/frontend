import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Concert from "../pages/Concert";
import ConcertDetails from "../pages/ConcertDetail";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Notice from "../pages/Notice";
import SupportLayout from "../pages/support/SupportLayout";
import NoticeBoard from "../pages/support/NoticeBoard";
import FaqBoard from "../pages/support/FaqBoard";
import InquiryBoard from "../pages/support/InquiryBoard";
import MyPage from "../pages/MyPage";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/concert/:id", element: <ConcertDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/notice", element: <Notice /> },
      { path: "/me", element: <MyPage /> },
    ],
  },
]);

export default router; 