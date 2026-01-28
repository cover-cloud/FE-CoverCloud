import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NTc2MjQwLCJleHAiOjE3Njk1Nzk4NDB9.aYP4bthMu4tjinyiFKcd0NDbOsKPEboK29dpcE3XYhdMOOaX91_6rkeuH8mxRir_xE_dMRP_1C6ZAuy2OdzZeQ",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
