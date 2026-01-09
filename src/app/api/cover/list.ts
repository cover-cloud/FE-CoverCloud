import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "DAILY,MONTHLY,WEEKLY";

interface FetchPopularCoverParams {
  page: number;
  size?: number;
  period?: Period;
  genre?: string; // 선택
}

const fetchPopularCoverList = async ({
  page,
  size,
  period,
  genre,
}: FetchPopularCoverParams) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/trending`,
    {
      params: {
        page,
        size,
        period,
        ...(genre && { genre }), // genre 있을 때만 붙음
      },
    }
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
