import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: (token, name) => {
    localStorage.setItem("token", token);
    set({ token, user: { name } });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
