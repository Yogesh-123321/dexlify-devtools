import { Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import LogoutConfirm from "@/components/LogoutConfirm";

export default function TopBar() {
  const { user } = useAuthStore(); // ✅ logout is handled inside LogoutConfirm

  return (
    <div className="flex flex-wrap justify-end items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-black text-sm sm:text-base">
      {user ? (
        <div className="flex flex-wrap items-center gap-3 text-gray-300">
          <p className="text-sm truncate max-w-[140px] sm:max-w-none">
            👋 Hello, {user.name}
          </p>
          <LogoutConfirm />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-1 rounded bg-primary hover:bg-primary/90 text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1 rounded bg-primary hover:bg-primary/90 text-white"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
