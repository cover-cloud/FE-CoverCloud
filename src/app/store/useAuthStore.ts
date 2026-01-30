import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NzM2OTM0LCJleHAiOjE3Njk3NDA1MzR9.ZL0CH2OuxZArL3skvpY93CFGmi9T3KRCuLLeY33MBUkpwf6IfiZGD3X-FIDfl5M2oV2RR2PWW1Hj8BVQw1xC6g",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
