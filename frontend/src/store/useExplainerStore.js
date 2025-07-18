import { create } from "zustand";

const useExplainerStore = create((set) => ({
  explanations: [],

  addExplanation: (item) =>
    set((state) => ({
      explanations: [...state.explanations, item],
    })),

  resetExplanations: () => set({ explanations: [] }),
}));

export default useExplainerStore;
