import { create } from "zustand";

const useAuthStore = create((set) => {
  // 🔄 Initialize from localStorage
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,
    token: storedToken,

    login: (token, name) => {
      const user = { name };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });
    },
  };
});

export default useAuthStore;
