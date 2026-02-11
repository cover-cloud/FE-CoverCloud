import { fetchAuthMeWithCookie } from "@/app/api/auth/authMe";
import { useAuthStore } from "@/app/store/useAuthStore";

export const completeLogin = async (accessToken: string) => {
  // 1. 토큰 저장
  useAuthStore.setState({ accessToken });

  // 2. 유저 정보 조회
  const me = await fetchAuthMeWithCookie(accessToken);

  // 3. 로그인 완료
  useAuthStore.setState({
    accessToken,
    userId: me.data.userId,
    isLogin: true,
  });

  return me;
};
