import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzcwOTU4NzM5LCJleHAiOjE3NzA5NjIzMzl9.Rc243Xd7KIpPP4t-jVNAzpDYYYFQ7HzqhMFI2fkIZxCmzx8i2-ybBnN2Xmbfsd1r",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
