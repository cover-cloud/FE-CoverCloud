"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useSnackbarStore } from "@/app/store/useSnackbar";

const CallbackPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("accessToken");
  React.useEffect(() => {
    // localStorage.setItem("isLogin", "true");
    if (token) {
      useAuthStore.setState({ isLogin: true });
      useAuthStore.setState({ accessToken: token });
      useSnackbarStore.getState().show("로그인되었습니다.", "success");
    } else {
      useSnackbarStore.getState().show("로그인에 실패했습니다.", "error");
    }
    // 필요하면 axios 기본 헤더 설정
    // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // 메인으로 이동
    router.push("/main/");
  }, []);

  return <div>로그인 중...</div>;
};

export default CallbackPage;
