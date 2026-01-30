import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NzQwNjI0LCJleHAiOjE3Njk3NDQyMjR9.L3ON2e1vZ4cHlWtguWQ8Uf50q6hwhkmA6p2A07QxWfw2Pta2xcSU3K7Y1FLMclX_38HuA_QEwZD9sMpH6GCH2w",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
