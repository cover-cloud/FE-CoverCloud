import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5NDExNDU3LCJleHAiOjE3Njk0MTUwNTd9.rnUHiOoIgC_wG6W0N8wD4qNRrZUffnGUXrLXl1aDDmUO2n2CEYpcG-w-MOVq-0bzecSJHBV7a2I-8bNdpL7p7g",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
