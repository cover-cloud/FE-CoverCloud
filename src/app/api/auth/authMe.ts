import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";

export const fetchAuthMeWithCookie = async (accessToken: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res) {
      return res.data;
    } else {
      // 로그아웃 로직
      useAuthStore.setState({ accessToken: "" });
    }
  } catch (error) {
    useAuthStore.setState({ accessToken: "" });
    return {
      success: false,
      message: "로그인 정보를 확인할 수 없습니다.",
    };
  }
};

export const useAuthMeQuery = (accessToken: string) => {
  const hasToken = !!accessToken;
  return useQuery({
    queryKey: ["auth-me-cookie"],
    queryFn: () => fetchAuthMeWithCookie(accessToken),
    enabled: hasToken,
    retry: false,
  });
};
