"use client";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Login = () => {
  const handleLogin = () => {
    const kakaoLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    };
    kakaoLogin();
  };
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
