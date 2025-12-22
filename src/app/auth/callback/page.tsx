"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
const CallbackPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      console.error("토큰 없음");
      return;
    }

    // ✅ 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // localStorage.setItem("isLogin", "true");
    useAuthStore.setState({ isLogin: true });
    // 필요하면 axios 기본 헤더 설정
    // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // 메인으로 이동
    router.push("/main/");
  }, []);

  return <div>로그인 중...</div>;
};

export default CallbackPage;
