import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    return { success: false };
  }
};
export const refreshAccessToken = async () => {
  const res = await refreshToken();
  if (!res?.data?.accessToken) return;
  useAuthStore.setState({ accessToken: res.data.accessToken });
};
