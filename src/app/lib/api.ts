import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/app/store/useAuthStore";
import { refreshToken } from "@/app/api/auth/refresh";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 인터페이스 정의 (커스텀 설정용)
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as CustomAxiosConfig;
    // 401 에러이고, 재시도한 적이 없는 요청일 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 갱신 중이라면 Queue에 넣고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResult = await refreshToken();

        if (refreshResult?.success) {
          const newAccessToken = refreshResult.data.accessToken;
          useAuthStore.setState({ accessToken: newAccessToken });

          // 1. 대기 중인 요청들 모두 처리
          processQueue(null, newAccessToken);

          // 2. 현재 실패했던 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        // 갱신 실패 시 대기 중인 모든 요청도 거절
        processQueue(refreshError, null);
        useAuthStore.setState({ accessToken: "" });
        // 로그인 페이지로 리다이렉트 시키는 로직 추가 권장
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
