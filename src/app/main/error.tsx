"use client";

import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import theme from "@/app/lib/theme";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        데이터를 불러오지 못했습니다.
      </Typography>
      <Typography sx={{ color: "#666", fontSize: "15px" }}>
        잠시 후 다시 시도해 주세요.
      </Typography>
      <Button
        onClick={reset}
        sx={{
          backgroundColor: theme.palette.orange.primary,
          color: "#fff",
          borderRadius: "25px",
          px: "24px",
          "&:hover": { backgroundColor: theme.palette.orange.secondary },
        }}
      >
        다시 시도
      </Button>
    </Box>
  );
}
