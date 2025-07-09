import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "@/components/TopBar";

function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-950 text-white overflow-auto">
        {/* ✅ Top bar at the top-right */}
        <TopBar />
        
        {/* ✅ Actual page content with padding */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
