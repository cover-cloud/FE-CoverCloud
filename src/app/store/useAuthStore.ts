import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NjY3NjQ5LCJleHAiOjE3Njk2NzEyNDl9.d3-yPu3Di4IhH0-CWPUFP3PHks_KcAnGRov95KMg406oipLucaemiu1EbN8XAWZMp18ShuBuSDq8BNZ3sALoYw",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
