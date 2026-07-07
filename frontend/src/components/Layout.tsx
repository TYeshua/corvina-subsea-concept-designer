import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 lg:px-8 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
