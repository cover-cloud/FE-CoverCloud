import { api } from "@/app/lib/api";

export const reportPost = async (postId: string) => {
  const res = api.post(`/cover/reportPost/${postId}`);
  return res;
};
