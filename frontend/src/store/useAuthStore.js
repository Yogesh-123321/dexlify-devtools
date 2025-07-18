import { create } from "zustand";
import useExplainerStore from "./useExplainerStore"; // ✅ Import the explainer store

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

      // ✅ Clear previous user's explanations on new login
      useExplainerStore.getState().resetExplanations();
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null });

      // ✅ Clear explanation history on logout
      useExplainerStore.getState().resetExplanations();

      window.location.reload(); // Keeps the UI fresh
    },
  };
});

export default useAuthStore;
