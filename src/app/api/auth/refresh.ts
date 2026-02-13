import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/useAuthStore";

export const refreshToken = async () => {
  try {
    const response = await api.post(
      `/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    // 1. 에러 로그 출력 (서버 터미널에서 확인용)

    // 2. 중요: 에러를 다시 던지지(throw) 마세요!
    // 대신 null이나 에러 객체를 반환하여 호출한 곳에서 처리하게 합니다.
    if (error instanceof Error && error.message.includes("401")) {
      return { success: false }; // 401 에러 시 안전하게 null 반환
    }

    // 다른 심각한 에러의 경우에도 최소한 null을 반환해야 서버가 죽지 않습니다.
    // useAuthStore.setState({ accessToken: "" });
    return { success: false };
  }
};
export const refreshAccessToken = async () => {
  const res = await refreshToken();
  useAuthStore.setState({ accessToken: res.data.accessToken });
};
