import { api } from "@/app/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";

const fetchCommentList = async (coverId: number) => {
  const res = await api.get(`/api/cover/comment/list`, {
    params: {
      coverId,
    },
  });
  return res.data;
};

export const useCommentListQuery = (coverId: number) => {
  return useQuery({
    queryKey: ["cover-comments", coverId],
    queryFn: () => fetchCommentList(coverId),
  });
};
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      coverId,
      parentCommentId,
      accessToken,
    }: {
      comment: string;
      coverId: number;
      parentCommentId?: number;
      accessToken: string;
    }) =>
      api.post(`/api/cover/comment/create`, {
        content: comment,
        coverId,
        parentCommentId,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-comments", variables.coverId],
      });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      accessToken,
      coverId,
    }: {
      commentId: number;
      accessToken: string;
      coverId: number;
    }) =>
      api.post(`/api/cover/comment/delete`, null, {
        params: {
          commentId,
        },
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-comments", variables.coverId],
      });
    },
  });
};
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
      accessToken,
      coverId,
    }: {
      commentId: number;
      content: string;
      accessToken: string;
      coverId: number;
    }) =>
      api.post(
        `/api/cover/comment/update`,
        { content },
        {
          params: {
            commentId,
          },
        },
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-comments", variables.coverId],
      });
    },
  });
};

const myCommentList = () => {
  try {
    const res = api.get(`/api/cover/comment/my`);
    if (res) {
      return res;
    } else {
      // 로그아웃 로직
      useAuthStore.setState({ accessToken: "" });
    }
  } catch (error) {
    useAuthStore.setState({ accessToken: "" });
  }
};
export const useMyCommentList = () => {
  return useQuery({
    queryKey: ["my-comment-list"],
    queryFn: () => {
      return myCommentList();
    },
    retry: false,
  });
};

export const useCommentLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      coverId,
      accessToken,
    }: {
      commentId: number;
      coverId: number;
      accessToken: string;
    }) =>
      api.post(`api/cover/comment/like`, null, {
        params: { commentId },
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cover-comments", variables.coverId],
      });
    },
  });
};
