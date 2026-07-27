import { create } from "zustand";

export interface AppState {
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnboarded: false,
  setIsOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
}));
