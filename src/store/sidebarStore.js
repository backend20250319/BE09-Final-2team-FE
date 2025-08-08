// store/sidebarStore.js
import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  sidebars: {},
  open: (key) =>
    set((state) => ({
      sidebars: { ...state.sidebars, [key]: true },
    })),
  close: (key) =>
    set((state) => ({
      sidebars: { ...state.sidebars, [key]: false },
    })),

  closeAll: () =>
    set((state) => ({
      sidebars: Object.keys(state.sidebars).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    })),
  toggle: (key) =>
    set((state) => ({
      sidebars: {
        ...state.sidebars,
        [key]: !state.sidebars[key],
      },
    })),
  isOpen: (key) => (state) => !!state.sidebars[key],
}));
