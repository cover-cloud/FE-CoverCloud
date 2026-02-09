import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import { api } from "@/app/lib/api";

export const fetchAuthMeWithCookie = async () => {
  try {
    const res = await api.get(`/api/auth/me`);
    if (res) {
      useAuthStore.setState({ isLogin: true });
      return res.data;
    } else {
      // 로그아웃 로직
      useAuthStore.setState({ isLogin: false });
    }
  } catch (error) {
    useAuthStore.setState({ isLogin: false });
  }
};

export const useAuthMeQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["auth-me-cookie", accessToken], // ✅ 핵심
    queryFn: fetchAuthMeWithCookie,
    retry: false,
  });
};
