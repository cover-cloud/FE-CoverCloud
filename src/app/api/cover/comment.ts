import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchCommentList = async (coverId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/list`,
    {
      params: {
        coverId,
      },
    }
  );
  return res.data;
};

export const useCommentListQuery = (coverId: string) => {
  return useQuery({
    queryKey: ["cover-comments"],
    queryFn: () => fetchCommentList(coverId),
  });
};

export const useCreateComment = async ({
  comment,
  coverId,
  parentCommentId,
  accessToken,
}: {
  comment: string;
  coverId: string;
  parentCommentId?: string;
  accessToken: string;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/comment/create`,

    {
      content: comment,
      coverId,
      parentCommentId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
