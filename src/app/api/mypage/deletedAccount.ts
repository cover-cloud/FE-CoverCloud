import { api } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";

export const deletedAccount = async () => {
  try {
    const result = await api.post("/api/user/account/delete");
    if (result.data.success) {
      useAuthStore.setState({ accessToken: "", userId: null, isLogin: false });
      useSnackbarStore.getState().show("계정이 삭제되었습니다.", "success");
    } else {
      useSnackbarStore.getState().show("계정 삭제에 실패했습니다.", "error");
    }
    return result;
  } catch (error) {
    useSnackbarStore.getState().show("계정 삭제에 실패했습니다.", "error");
  }
};
