import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";

export const logout = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    useAuthStore.setState({
      accessToken: "",
      userId: null,
      isLogin: false,
    });
    return response.data;
  } catch (error) {
    useAuthStore.setState({
      accessToken: "",
      userId: null,
      isLogin: false,
    });
    return { success: false };
  }
};
