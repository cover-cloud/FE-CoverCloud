"use client";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import theme from "@/app/lib/theme";
import { useMediaQuery } from "@mui/material";

const Login = () => {
  const handleLogin = (loginType: "kakao" | "naver") => {
    if (loginType === "kakao") {
      window.location.href =
        "https://www.covercloud.kr/oauth2/authorization/kakao";
    } else {
      window.location.href =
        "https://www.covercloud.kr/oauth2/authorization/naver";
    }
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100%",
        height: "449px",
        borderRadius: "8px",
        padding: isMobile ? "0px" : "50px",
      }}
    >
      <h1
        className="H1 text-center color-black"
        style={{ marginBottom: "30px" }}
      >
        계정 로그인
      </h1>
      <Box className="flex flex-col items-center gap-2 w-[80%]">
        <Button
          variant="contained"
          onClick={() => handleLogin("kakao")}
          sx={{
            position: "relative",
            backgroundColor: "#FEE500",
            color: theme.palette.common.black,
            width: "100%",
            maxWidth: "300px",
            height: "48px",
            fontSize: "20px",
            fontWeight: 400,

            mb: 2,
            ":hover": {
              backgroundColor: "#FEE500",
            },
          }}
        >
          <RiKakaoTalkFill
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "16px",
              marginRight: "8px",
              fontSize: "28px",
              color: theme.palette.common.black,
            }}
          />
          카카오 로그인
        </Button>
        <Button
          variant="contained"
          sx={{
            position: "relative",
            height: "48px",
            backgroundColor: "#03C75A",
            color: theme.palette.common.white,
            width: "100%",
            maxWidth: "300px",
            fontSize: "18px",
            fontWeight: 400,
            ":hover": {
              backgroundColor: "#03C75A",
            },
          }}
          onClick={() => handleLogin("naver")}
        >
          <SiNaver
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "16px",
              marginRight: "8px",
              fontSize: "20px",
            }}
          />
          네이버 로그인
        </Button>
        <Box className="B1 text-center" sx={{ padding: "40px 12px" }}>
          소셜 로그인으로 가입 할 시 이용약관,
          <br />
          개인정보처리방침에 동의한 것으로 간주합니다.
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
