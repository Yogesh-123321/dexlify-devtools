import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-950 text-white overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

// ✅ Add this line:
export default AppLayout;
