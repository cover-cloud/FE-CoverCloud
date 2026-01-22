import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "ALL";

interface FetchPopularCoverParams {
  page: number;
  size?: number;
  period?: Period;
  genres?: string[]; // 선택
}

const fetchPopularCoverList = async ({
  page,
  size,
  period,
  genres,
}: FetchPopularCoverParams) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/trending/search`,

    {
      params: {
        page,
        size,
        period: period === "ALL" ? undefined : period,
        genres,
      },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY5MDU1ODc4LCJleHAiOjE3NjkwNTk0Nzh9._smnYkjuBq6g9u2IHuUZlml6dnObLHRBKpe9dsNGxn-abJIqfOrahqz3jOTXik4OBPgLDc-MKl9k5Lev0YqREw`,
      },
    },
  );

  return res.data.data;
};

export const usePopularCoverListQuery = ({
  page,
  size,
  period,
  genres,
}: FetchPopularCoverParams) => {
  return useQuery({
    queryKey: ["cover-trending", page, size, period, genres],
    queryFn: () =>
      fetchPopularCoverList({
        page,
        size,
        period,
        genres,
      }),
    // staleTime: 1000 * 60,
  });
};
