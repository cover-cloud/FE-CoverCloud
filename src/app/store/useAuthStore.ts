import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzcwNjE2NjY5LCJleHAiOjE3NzA2MjAyNjl9.zKmwUtBP28FXNkokTi_TL5ZD4t26lxMnpfsysxZA3cH1jdwDmwsu23fGmCyszOpe",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
