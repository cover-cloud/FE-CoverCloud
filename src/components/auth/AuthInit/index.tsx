"use client";
import { refreshToken } from "@/app/api/auth/refresh";
import { useEffect } from "react";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const accessToken = refreshToken();
  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  return <div>{children}</div>;
};

export default AuthInit;
