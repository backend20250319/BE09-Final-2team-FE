import { useSidebarStore } from "@/store/sidebarStore";

export const useSidebar = (key) => {
  const isOpen = useSidebarStore((state) => state.sidebars[key]);

  const open = () => useSidebarStore.getState().open(key);
  const close = () => useSidebarStore.getState().close(key);
  const toggle = () => useSidebarStore.getState().toggle(key);
  const closeAll = () => useSidebarStore.getState().closeAll();

  return { isOpen, open, close, toggle, closeAll };
};
