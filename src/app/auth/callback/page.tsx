"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeLogin } from "@/app/utils/auth.service";
import { useSnackbarStore } from "@/app/store/useSnackbar";
export const dynamic = "force-dynamic";
export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("accessToken");

  useEffect(() => {
    if (!token) {
      useSnackbarStore.getState().show("로그인에 실패했습니다.", "error");
      return;
    }

    (async () => {
      try {
        await completeLogin(token);
        useSnackbarStore.getState().show("로그인되었습니다.", "success");
        // router.replace("/main");
      } catch {
        useSnackbarStore.getState().show("로그인에 실패했습니다.", "error");
      }
    })();
  }, [token]);

  return <div>로그인 중...</div>;
}
