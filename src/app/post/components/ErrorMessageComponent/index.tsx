import React from "react";
import { Box } from "@mui/material";
import { MdErrorOutline } from "react-icons/md";
const ErrorMessageComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="flex items-center">
      <MdErrorOutline color="red" size={30} className="mr-2" />
      <Box sx={{ fontSize: "20px", color: "red" }}>{children}</Box>
    </Box>
  );
};

export default ErrorMessageComponent;
