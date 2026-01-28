import { api } from "@/app/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const fetchLike = async (coverId: string) => {
  const res = await api.post(`/api/cover/${coverId}/like`);
  return res.data;
};

export const fetchUnlike = async (coverId: string) => {
  const res = await api.post(`/api/cover/${coverId}/unlike`);
  return res.data;
};

export const useLikeMutation = (coverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchLike(coverId),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["readingPost", coverId],
    //   });
    // },
  });
};

export const useUnlikeMutation = (coverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchUnlike(coverId),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["readingPost", coverId],
    //   });
    // },
  });
};
