import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "ALL";

interface FetchPopularCoverParams {
  page: number;
  size?: number;
  period?: Period;
  genre?: string[]; // 선택
}

const fetchPopularCoverList = async ({
  page,
  size,
  period,
  genre,
}: FetchPopularCoverParams) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/trending/search`,
    {
      params: {
        page,
        size,
        period: period === "ALL" ? undefined : period,
        genre, // genre 있을 때만 붙음
      },
    },
  );

  return res.data.data;
};

export const usePopularCoverListQuery = ({
  page,
  size,
  period,
  genre,
}: FetchPopularCoverParams) => {
  return useQuery({
    queryKey: ["cover-trending", page, size, period, genre],
    queryFn: () =>
      fetchPopularCoverList({
        page,
        size,
        period,
        genre,
      }),
    // staleTime: 1000 * 60,
  });
};
