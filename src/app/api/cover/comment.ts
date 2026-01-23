import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchCommentList = async (coverId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/list`,
    {
      params: {
        coverId,
      },
    },
  );
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
      axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/create`,
        { content: comment, coverId, parentCommentId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/delete`,
        null,
        {
          params: {
            commentId,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/update`,
        { content },
        {
          params: {
            commentId,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
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

const myCommentList = (accessToken: string) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/my`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};
export const useMyCommentList = (accessToken: string) => {
  return useQuery({
    queryKey: ["my-comment-list"],
    queryFn: () => {
      return myCommentList(accessToken);
    },
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
      axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/like`,
        null,
        {
          params: { commentId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
