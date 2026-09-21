import { create } from "zustand";
import type { Store } from "@/types/models";

interface SelectedState {
  store: Store | null;
  images: string[];
  setStore: (store: Store | null) => void;
  setImages: (images: string[]) => void;
  reset: () => void;
}

export const useSelectedStore = create<SelectedState>(set => ({
  store: null,
  images: [],
  setStore: store => set({ store }),
  setImages: images => set({ images }),
  reset: () => set({ store: null, images: [] }),
}));
