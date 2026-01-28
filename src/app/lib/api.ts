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

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 400 && !originalRequest._retry) {
//       // 이미 refresh 중이면 대기
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           failedQueue.push((token: string) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(api(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshResult = await refreshToken();

//       // ❌ refresh 실패
//       if (!refreshResult?.success) {
//         useAuthStore.setState({ accessToken: "" });

//         //모달띄워줄까?
//         return Promise.reject(error);
//       }

//       // ✅ refresh 성공
//       const newAccessToken = refreshResult.data.accessToken;

//       useAuthStore.setState({ accessToken: newAccessToken });

//       processQueue(newAccessToken);
//       isRefreshing = false;

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       return api(originalRequest);
//     }

//     return Promise.reject(error);
//   },
// );
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // console.log("🔴 === INTERCEPTOR 진입 ===");
    // console.log("error.response:", error.response);
    // console.log("status:", error.response?.status);
    // console.log("status type:", typeof error.response?.status);
    // console.log("url:", error.config?.url);

    const originalRequest = error.config;
    // console.log("originalRequest:", originalRequest);
    // console.log("_retry:", originalRequest?._retry);
    // console.log("_retry type:", typeof originalRequest?._retry);

    // 조건 하나하나 체크
    const is400 = error.response?.status === 400;
    const notRetried = !originalRequest?._retry;

    // console.log("is400?", is400);
    // console.log("notRetried?", notRetried);
    // console.log("조건 통과?", is400 && notRetried);

    if (error.response?.status === 400 && !originalRequest._retry) {
      // console.log("✅✅✅ 400 로직 진입! ✅✅✅");

      // 이미 refresh 중이면 대기
      if (isRefreshing) {
        // console.log("⏳ 이미 refresh 중...");
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      // console.log("🔄 refresh 토큰 시작");
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshResult = await refreshToken();
      // console.log("refreshResult:", refreshResult);

      // ❌ refresh 실패
      if (!refreshResult?.success) {
        // console.log("❌ refresh 실패");
        useAuthStore.setState({ accessToken: "" });
        isRefreshing = false;
        return Promise.reject(error);
      }

      // ✅ refresh 성공
      // console.log("✅ refresh 성공");
      const newAccessToken = refreshResult.data.accessToken;

      useAuthStore.setState({ accessToken: newAccessToken });

      processQueue(newAccessToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }

    // console.log("⚠️ 400 조건 불일치 - reject");
    return Promise.reject(error);
  },
);
