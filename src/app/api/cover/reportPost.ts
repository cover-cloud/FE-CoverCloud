import { api } from "@/app/lib/api";

export const reportPost = async (postId: string) => {
  const res = api.post(`/cover/reportPost/${postId}`);
  return res;
};

export const reportComment = async (commentId: string) => {
  const res = api.post(`/api/cover/comment/report/${commentId}`);
  return res;
};
