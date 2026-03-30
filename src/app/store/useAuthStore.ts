import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI1MDMiLCJ1c2VySWQiOjUwMywidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc3NDg0ODk0NiwiZXhwIjoxNzc0ODUyNTQ2fQ.LzQB6Q-m1rwo-G4qRVKHvsdn-0_dkgVA1yylqI0M0K6V10x5NCJ64aXJSUqiX6-l",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
