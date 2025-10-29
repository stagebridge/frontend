import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar";

export default function AppLayout() {
  return (
    // 기본 배경/글자색 + 다크일 때 배경/글자색
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0f1115] dark:text-slate-100">
      <Navbar />
      <main className="mx-auto w-[1200px] py-6">
        <Outlet />
      </main>
    </div>
  );
}
