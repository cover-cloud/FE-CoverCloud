import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";

export const fetchAuthMeWithCookie = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // API 응답 구조에 따라 다르겠지만, 보통 성공하면 객체를 감싸서 반환합니다.
    if (res && res.data) {
      useAuthStore.setState({ isLogin: true });
      // 반환 형식을 통일합니다.
      return res.data;
    }

    throw new Error("No data received");
  } catch (error) {
    useAuthStore.setState({ isLogin: false });
    return {
      success: false,
      message: "로그인 정보를 확인할 수 없습니다.",
    };
  }
};
export const useAuthMeQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userProfileUrl = useAuthStore((state) => state.userProfileUrl);
  return useQuery({
    queryKey: ["auth-me-cookie", accessToken, userProfileUrl], // ✅ 핵심
    queryFn: fetchAuthMeWithCookie,
    retry: false,
  });
};
