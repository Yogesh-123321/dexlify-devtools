import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: localStorage.getItem("token")
    ? { name: "User", token: localStorage.getItem("token") }
    : null,

  login: (token, name) => {
    localStorage.setItem("token", token);
    set({ user: { name, token } });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));


export default useAuthStore;
