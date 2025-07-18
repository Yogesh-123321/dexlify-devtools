import { create } from "zustand";

const useAuthStore = create((set) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return {
    user,
    token,

    login: (token, user) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
      window.location.reload(); // ✅ Page refresh on logout
    },
  };
});

export default useAuthStore;
