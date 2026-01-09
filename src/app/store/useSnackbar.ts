import { create } from "zustand";

interface SnackbarState {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  show: (msg: string, severity?: SnackbarState["severity"]) => void;
  close: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  show: (message, severity = "info") => set({ open: true, message, severity }),
  close: () => set({ open: false }),
}));
