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
      userProfileUrl: accessToken.data.profileImage || "",
      isLogin: true,
    });
  };

  useEffect(() => {
    if (pathname.startsWith("/auth/callback")) return;

    refreshTokenHandler();
  }, []);
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(max-width: 767px)");

  //   const handleChange = (e: MediaQueryListEvent) => {
  //     useMobaileModeStore.setState({
  //       isMobile: e.matches,
  //     });
  //   };

  //   useMobaileModeStore.setState({
  //     isMobile: mediaQuery.matches,
  //   });
  //   mediaQuery.addEventListener("change", handleChange);

  //   return () => {
  //     mediaQuery.removeEventListener("change", handleChange);
  //   };
  // }, []);
  return <>{children}</>;
};

export default AuthInit;
