import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";

export const logout = async (accessToken: string) => {
  // TODO: 로그아웃 API 호출
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  useAuthStore.setState({
    accessToken: undefined,
    userId: undefined,
    isLogin: false,
  });

  return response;
};
