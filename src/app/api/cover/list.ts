import { api } from "@/app/lib/api";
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

  const res = await api.post(`/api/cover/list`, body);

  return res.data.data;
};

export const fetchPopularCoverListServer = async ({
  page,
  size = 18,
  period,
  genres,
}: FetchPopularCoverParams) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const body: any = { page, size };

  if (period && period !== "ALL") {
    body.period = period;
  }
  if (genres?.length) {
    body.genres = genres.map((g) => GENRE_MAP[g]).filter(Boolean);
  }

  const res = await fetch(`${baseUrl}/api/cover/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json();
  return json.data;
};

export const usePopularCoverListQuery = ({
  page,
  size,
  period,
  genres,
  initialData,
}: FetchPopularCoverParams & { initialData?: any }) => {
  return useQuery({
    queryKey: ["cover-trending", page, size, period, genres],
    queryFn: () =>
      fetchPopularCoverList({
        page,
        size,
        period,
        genres,
      }),
    ...(initialData ? { initialData } : {}),
  });
};
