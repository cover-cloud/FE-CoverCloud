import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5MTQzODA1LCJleHAiOjE3NjkxNDc0MDV9.uQFzpqcVmLHSB6AbLO506R88VLv8SYFua_dovtUAmpvbWaAKH26zjyP69fsMwc9q0cbRuWY7OzyHjgaRMQTlLQ",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
