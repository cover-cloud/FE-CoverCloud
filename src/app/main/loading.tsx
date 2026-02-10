import { Box, CircularProgress } from "@mui/material";
import theme from "../lib/theme";

export default function Loading() {
  return (
    <Box
      className="mt-8"
      sx={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        size={64}
        sx={{ color: theme.palette.orange.primary }}
      />
    </Box>
  );
}
