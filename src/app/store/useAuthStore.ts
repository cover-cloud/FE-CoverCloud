import { create } from "zustand";

interface AuthStore {
  isLogin: boolean;
  accessToken: string;
  userId: number | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  accessToken:
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzcwNDUwNTkyLCJleHAiOjE3NzA0NTQxOTJ9.ksEV7oUOXnski_P4uKiculrkVXzvNJEUw-KSNhyOysBWtzEQz2KjvPUY79FJjDeK",
  userId: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
