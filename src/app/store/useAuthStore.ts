import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzczMTMxNjAwLCJleHAiOjE3NzMxMzUyMDB9.S-h4JxqN7UrNL6wq9VpN0Ldr3_k_lrb3Qp-THtgN92DOtpOSoGUegBeXEkf8jpAi",

  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
