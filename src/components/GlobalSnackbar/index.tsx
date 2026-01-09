"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbarStore } from "@/app/store/useSnackbar";

const GlobalSnackbar = () => {
  const { open, message, severity, close } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={close}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
