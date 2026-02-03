import { useAuthStore } from "../store/useAuthStore";
import { useModalStore } from "../store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
const accessToken = useAuthStore((state) => state.accessToken);
const isLogin = useAuthStore((state) => state.isLogin);
const openLoginModal = useModalStore((state) => state.openLoginModal);

export const requireAuth = (
  accessToken: string,
  isLogin: boolean,
  message: string,
  type: "error" | "warning",
) => {
  if (!isLogin && !accessToken) {
    openLoginModal();
    useSnackbarStore.getState().show(message, type);
    return;
  }
};
