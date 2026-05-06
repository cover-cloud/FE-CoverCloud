import axios from "axios";
import { useAuthStore } from "@/app/store/useAuthStore";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return { success: false };
    }

    return { success: false };
  }
};
export const refreshAccessToken = async () => {
  const res = await refreshToken();
  if (!res?.data?.accessToken) return;
  useAuthStore.setState({ accessToken: res.data.accessToken });
};
