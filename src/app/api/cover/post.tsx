import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type PostData = {
  videoUrl?: string;
  originalTitle?: string;
  originalArtist?: string;
  coverArtist?: string;
  title?: string;
  genre?: string;
  tags?: string[];
};

export const createPost = async (postData: PostData, accessToken: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/create`,
    postData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const updatePost = async (
  coverId: string,
  postData: PostData,
  accessToken: string,
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/update?coverId=${coverId}`,
    postData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deletePost = async (
  coverId: string | string[],
  accessToken: string,
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/delete?coverId=${coverId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const readingPost = async (coverId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/list/${coverId}`,
  );
  return res;
};
export const useReadingPost = (coverId: string) => {
  return useQuery({
    queryKey: ["readingPost", coverId],
    queryFn: () => readingPost(coverId),
    enabled: !!coverId,
  });
};
