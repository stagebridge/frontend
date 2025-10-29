import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./App";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
]);

export default router;
