import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5MTUzMzIzLCJleHAiOjE3NjkxNTY5MjN9.qJYJV_i-rKSlsu5Tn4vFIX3KUiVtwpvXCvp_ZGtAbK5sxRaDTb6By4iwUiuRfs-3mo4VDC50IB2I-gIk-CapmA",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
