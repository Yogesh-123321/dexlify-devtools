import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "@/components/TopBar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for medium and up */}
      <div className="hidden md:block w-64 bg-gray-900">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-gray-900">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-0">
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

        {/* Desktop TopBar */}
          <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
