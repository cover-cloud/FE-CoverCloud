"use client";
import React from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/main"); // ← 이동시키고 싶은 경로
  }, [router]);
  return <Box></Box>;
};

export default Home;
