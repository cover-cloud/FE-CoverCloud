import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken: "",
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
