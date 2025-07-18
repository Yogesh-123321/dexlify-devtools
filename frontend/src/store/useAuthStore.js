import { create } from "zustand";

const useAuthStore = create((set) => {
  // Load token and user from localStorage initially
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return {
    user,
    token,

    // ✅ Store full user object from backend (includes _id, name, email, etc.)
    login: (token, user) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
      window.location.reload(); // ✅ Ensures UI updates after logout
    },
  };
});

export default useAuthStore;
