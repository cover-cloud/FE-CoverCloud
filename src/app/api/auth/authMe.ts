import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import { api } from "@/app/lib/api";

export const fetchAuthMeWithCookie = async () => {
  try {
    const res = await api.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
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

export const useAuthMeQuery = () => {
  return useQuery({
    queryKey: ["auth-me-cookie"],
    queryFn: () => fetchAuthMeWithCookie(),

    retry: false,
  });
};
