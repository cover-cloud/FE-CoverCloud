import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
  userProfileUrl: string;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken: "",
  userId: null,
  userProfileUrl: "",
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  setUserProfileUrl: (userProfileUrl: string) => set({ userProfileUrl }),
}));
