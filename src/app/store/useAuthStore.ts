import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NzQ0MjgwLCJleHAiOjE3Njk3NDc4ODB9.DCmarQDE2ggnS1O7eZQ6Lfok1E5-YyB1YD9VubjYsbXdh0dc6O-VcwYV_8-ZKlVe2axvARFXvLLyyi0Zh-pxWw",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
