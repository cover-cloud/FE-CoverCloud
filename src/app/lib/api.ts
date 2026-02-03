// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
import { useAuthStore } from "@/app/store/useAuthStore";

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
import { refreshToken } from "@/app/api/auth/refresh";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (token: string | null) => {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
};

({ accessToken: "" });

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 조건 하나하나 체크
    const is401 = error.response?.status === 401;
    const notRetried = !originalRequest?._retry;

    if (is401 && notRetried) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshResult = await refreshToken();

      // ❌ refresh 실패
      if (!refreshResult?.success) {
        useAuthStore.setState({ accessToken: "" });
        isRefreshing = false;
        return Promise.reject(error);
      }

      // ✅ refresh 성공
      const newAccessToken = refreshResult.data.accessToken;

      useAuthStore.setState({ accessToken: newAccessToken });

      processQueue(newAccessToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
