import { api } from "@/app/lib/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "ALL";

export type PopularCoverItem = {
  commentCount: number;
  coverArtist: string;
  coverGenre: string;
  coverId: number;
  coverTitle: string;
  createdAt: string;
  isAuthorDeleted: boolean;
  isLiked: boolean;
  isReported: boolean;
  likeCount: number;
  link: string;
  musicId: number;
  nickname: string;
  originalArtist: string;
  originalCoverImageUrl: string;
  originalTitle: string;
  profileImage: string;
  reportDescription: string | null;
  reportReason: string | null;
  tags: string[];
  userId: number;
  viewCount: number;
};

export type CoverListPage = {
  content: PopularCoverItem[];
  isFirst: boolean;
  isLast: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string | null;
  data: T;
};

export type CoverListPageResponse = ApiResponse<CoverListPage>;
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
  const body: {
    page: number;
    size: number;
    period?: Period;
    genres?: string[];
  } = {
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
  const body: {
    page: number;
    size: number;
    period?: Period;
    genres?: string[];
  } = { page, size };

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
}: FetchPopularCoverParams & { initialData?: CoverListPageResponse }) => {
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
