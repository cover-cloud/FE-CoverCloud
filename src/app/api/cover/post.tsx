import { api } from "@/app/lib/api";
import { useQuery } from "@tanstack/react-query";

export type PostData = {
  videoUrl?: string;
  originalTitle?: string;
  originalArtist?: string;
  coverArtist?: string;
  title?: string;
  genre?: string;
  tags?: string[];
};

export const createPost = async (postData: PostData) => {
  const res = await api.post(`/api/cover/create`, postData);
  return res.data;
};

export const updatePost = async (coverId: string, postData: PostData) => {
  const res = await api.post(`/api/cover/update?coverId=${coverId}`, postData);
  return res.data;
};

export const deletePost = async (coverId: string | string[]) => {
  const res = await api.post(`/api/cover/delete?coverId=${coverId}`, null);
  return res.data;
};

export const readingPost = async (coverId: string) => {
  try {
    const res = await api.get(`/api/cover/list/${coverId}`);
    return res;
  } catch (error) {
    throw error;
  }
};
export const useReadingPost = (coverId: string, initialData?: any) => {
  return useQuery({
    queryKey: ["readingPost", coverId],
    queryFn: () => readingPost(coverId),
    enabled: !!coverId,
    initialData,
  });
};
