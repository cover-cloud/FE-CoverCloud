// app/layout.tsx
import React from "react";
import Box from "@mui/material/Box";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box className="">{children}</Box>;
}
