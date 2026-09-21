import { create } from "zustand";
import type { UserProfile } from "@/types/models";

interface UserState {
  user: UserProfile | null;
  isAdmin: boolean;
  setUser: (user: UserProfile | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  isAdmin: false,
  setUser: user => set({ user }),
  setAdmin: isAdmin => set({ isAdmin }),
  reset: () => set({ user: null, isAdmin: false }),
}));
