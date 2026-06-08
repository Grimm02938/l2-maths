import { create } from 'zustand';

interface useContactModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useContactModal = create<useContactModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));