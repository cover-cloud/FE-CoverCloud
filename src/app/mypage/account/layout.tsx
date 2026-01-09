import React from "react";
import { Box } from "@mui/material";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box sx={{ width: "60%", mx: "auto" }}>{children}</Box>;
};

export default AccountLayout;
