"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeLogin } from "@/app/utils/auth.service";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { refreshToken } from "@/app/api/auth/refresh";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function CallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const refreshTokenHandler = async () => {
      const accessToken = await refreshToken();
      useAuthStore.setState({
        accessToken: accessToken.data.accessToken,
        isLogin: true,
      });
      if (!accessToken.data.accessToken) {
        useSnackbarStore.getState().show("로그인에 실패했습니다.", "error");
        return;
      }

      (async () => {
        try {
          await completeLogin(accessToken.data.accessToken);
          useSnackbarStore.getState().show("로그인되었습니다.", "success");
          router.replace("/main");
        } catch {
          useSnackbarStore.getState().show("로그인에 실패했습니다.", "error");
        }
      })();
    };

    refreshTokenHandler();
  }, [router]);

  return <div>로그인 중...</div>;
}
