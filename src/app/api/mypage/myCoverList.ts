import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import { api } from "@/app/lib/api";
const myCoverList = async (page: number, size: number) => {
  try {
    const res = await api.get(`/api/cover/my?page=${page}&size=${size}`);
    if (res) {
      return res.data;
    } else {
      // 로그아웃 로직
      useAuthStore.setState({ accessToken: "", isLogin: false });
    }
  } catch (error) {
    useAuthStore.setState({ accessToken: "", isLogin: false });
    return {
      success: false,
      message: "로그인 정보를 확인할 수 없습니다.",
    };
  }
};
const myCommentPostList = async (page: number, size: number) => {
  const res = await api.get(`/api/cover/my/comments?page=${page}&size=${size}`);
  if (res) {
    return res.data;
  }
};
const myLikePostList = async (page: number, size: number) => {
  const res = await api.get(`/api/cover/my/likes?page=${page}&size=${size}`);
  if (res) {
    return res.data;
  }
};
export const useMyCoverListQuery = (
  accessToken: string,
  page: number,
  size: number,
  type: "recommend" | "like" | "comment",
) => {
  const hasToken = !!accessToken;
  return useQuery({
    queryKey: ["myCoverList", page, size, type],
    queryFn:
      type === "comment"
        ? () => myCommentPostList(page, size)
        : type === "like"
          ? () => myLikePostList(page, size)
          : () => myCoverList(page, size),
    enabled: hasToken,
    retry: false,
  });
};
