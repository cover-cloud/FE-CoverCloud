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

export const createPost = async (postData: PostData) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    "http://localhost:8080/api/cover/create",
    postData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const updatePost = async (coverId: string, postData: PostData) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `http://localhost:8080/api/cover/update?coverId=${coverId}`,
    postData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const deletePost = async (coverId: string | string[]) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `http://localhost:8080/api/cover/delete?coverId=${coverId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
