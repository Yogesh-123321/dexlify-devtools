import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "@/components/TopBar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-black">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col w-0 bg-black">
        {/* Mobile top bar */}
        <div className="md:hidden p-4 flex justify-between items-center bg-gray-800 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl font-bold"
          >
            ☰
          </button>
          <span className="text-white font-bold text-lg">Dexlify</span>
        </div>

        {/* Desktop top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-black text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
