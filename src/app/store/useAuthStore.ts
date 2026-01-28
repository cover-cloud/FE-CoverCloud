import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NTg1OTYxLCJleHAiOjE3Njk1ODk1NjF9.qlgY3sSEbXXtu6iGTpl85IwhOB9MvI51WeWZL8t0bj5JFltdpodoU4Xq0cVoi2JvSmemqd2uiNhfQBOTS0fjlg",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
