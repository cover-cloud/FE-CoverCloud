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
    }
    // {
    //   headers: {
    //     Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoyLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzY4Mzk0NzY5LCJleHAiOjE3NjgzOTgzNjl9.ufEW0k1jkk82v8g6oacjwQkYBtWTI4IbyWuXb_J3u2cXgOosJEomWQm3AIdkQmXJUaIIRHDi9czWfJhyh4EvRw`,
    //   },
    // }
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
