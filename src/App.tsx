import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </main>
    </>
  );
}
