import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
  setIsLogin: (isLogin: boolean) => void;
  setAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      accessToken: process.env.NEXT_PUBLIC_DEV_TOKEN ?? "",
      userId: null,
      setIsLogin: (isLogin: boolean) => set({ isLogin }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
    }),
    {
      name: "auth",
      partialize: (state) => ({ isLogin: state.isLogin }),
    },
  ),
);
