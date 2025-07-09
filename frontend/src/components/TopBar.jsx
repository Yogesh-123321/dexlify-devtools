import { Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import LogoutConfirm from "@/components/LogoutConfirm";

export default function TopBar() {
  const { user } = useAuthStore(); // ✅ logout is handled inside LogoutConfirm

  return (
    <div className="flex justify-end items-center px-6 py-3 border-b border-zinc-800 bg-black">
      {user ? (
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-300">👋 Hello, {user.name}</p>
          {/* ✅ Replace this with the modal */}
          <LogoutConfirm />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm px-3 py-1 rounded bg-primary hover:bg-primary/90 text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm px-3 py-1 rounded bg-primary hover:bg-primary/90 text-white"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
