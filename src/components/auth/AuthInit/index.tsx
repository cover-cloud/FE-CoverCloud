"use client";
import { refreshToken } from "@/app/api/auth/refresh";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const refreshTokenHandler = async () => {
    const accessToken = await refreshToken();
    useAuthStore.setState({ accessToken, isLogin: true });
  };

  useEffect(() => {
    refreshTokenHandler();
  }, []);

  return <div>{children}</div>;
};

export default AuthInit;
