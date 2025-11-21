"use client";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Login = () => {
  const kakao: any = (window as any).Kakao;
  React.useEffect(() => {
    if (kakao && !kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
    }
  }, []);
  const handleLogin = () => {
    kakao.Auth.login({
      scope: "profile_nickname,account_email",
      success: (authObj: any) => console.log(authObj.access_token),
      fail: (err: any) => console.error(err),
    });
  };
  console.log("Kakao Key:", process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
  return (
    <div>
      <h1 className="text-2xl font-bold text-center color-black">로그인</h1>
      <Box className="flex flex-col items-center gap-2">
        <Button variant="contained" onClick={handleLogin}>
          카카오
        </Button>
        <Button variant="contained">네이버</Button>
      </Box>
    </div>
  );
};

export default Login;
