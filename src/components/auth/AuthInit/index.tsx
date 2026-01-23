"use client";

import { refreshToken } from "@/app/api/auth/refresh";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { usePathname } from "next/navigation";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const refreshTokenHandler = async () => {
    const accessToken = await refreshToken();

    if (!accessToken) return;

    useAuthStore.setState({
      accessToken,
      isLogin: true,
    });
  };

  useEffect(() => {
    if (pathname.startsWith("/auth/callback")) return;

    refreshTokenHandler();
  }, [pathname]);

  return <>{children}</>;
};

export default AuthInit;
