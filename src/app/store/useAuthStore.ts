import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: true,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
}));
