import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "ALL";

interface FetchPopularCoverParams {
  page: number;
  size?: number;
  period?: Period;
  genres?: string[]; // 선택
}
const GENRE_MAP: Record<string, string> = {
  K_POP: "K_POP",
  J_POP: "J_POP",
  POP: "POP",
  OTHER: "OTHER",
};

const fetchPopularCoverList = async ({
  page,
  size = 18,
  period,
  genres,
}: FetchPopularCoverParams) => {
  const body: any = {
    page,
    size,
  };

  if (period && period !== "ALL") {
    body.period = period;
  }

  if (genres?.length) {
    body.genres = genres.map((g) => GENRE_MAP[g]).filter(Boolean);
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/trending/search`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
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
