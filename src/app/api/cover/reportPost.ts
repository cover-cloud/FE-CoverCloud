import { api } from "@/app/lib/api";
import { useSnackbarStore } from "@/app/store/useSnackbar";

export const reportPost = async (postId: string) => {
  const res = api.post(`/api/cover/reportPost`, {
    coverId: postId,
    reason: "INAPPROPRIATE_CONTENT", // 부적절한 콘텐츠
    description: "", // 기타일경우 상세사유
  });
  return res;
};

//  "COPYRIGHT",     // 저작권 침해
// 				   "HARASSMENT",                 // 괴롭힘
// 				   "SPAM",                       // 스팸
// 				   "OTHER"
export const reportComment = async (commentId: number) => {
  try {
    const res = await api.post(`/api/cover/comment/report`, {
      commentId: commentId,
      reason: "INAPPROPRIATE", // 부적절한 콘텐츠
    });

    if (res.data?.success) {
      useSnackbarStore.getState().show("댓글이 신고되었습니다.", "success");
      return;
    }
  } catch (error: any) {
    if (
      !error?.response?.data?.success &&
      error?.response?.data?.message ===
        "You have already reported this comment"
    ) {
      useSnackbarStore.getState().show("이미 신고된 댓글입니다.", "error");
      return;
    }
    useSnackbarStore.getState().show("댓글신고에 실패했습니다.", "error");
  }
};
