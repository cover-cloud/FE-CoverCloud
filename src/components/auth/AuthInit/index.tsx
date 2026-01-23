"use client";

import { refreshToken } from "@/app/api/auth/refresh";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { usePathname } from "next/navigation";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const refreshTokenHandler = async () => {
    const accessToken = await refreshToken();

    if (!accessToken.success) return;

    useAuthStore.setState({
      accessToken: accessToken.data.accessToken,
      isLogin: true,
    });
  };

  useEffect(() => {
    if (pathname.startsWith("/auth/callback")) return;

    refreshTokenHandler();
  }, []);

  return <>{children}</>;
};

export default AuthInit;
