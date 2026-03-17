import { api } from "@/app/lib/api";
import { useQuery } from "@tanstack/react-query";
type SearchType = "title" | "tags";

const search = async (
  type: SearchType,
  keyword: string,
  page: number,
  size: number,
  sortBy: "LATEST" | "POPULAR",
) => {
  const endpoint =
    type === "title" ? "/api/cover/search/title" : "/api/cover/search/tags";

  const paramKey = type === "title" ? "title" : "tags";

  const res = await api.get(endpoint, {
    params: {
      [paramKey]: keyword,
      page,
      size,
      sortBy,
    },
  });

  return res.data;
};

export const useSearchQuery = ({
  type,
  keyword,
  page,
  size,
  sortBy,
}: {
  type: SearchType;
  keyword: string;
  page: number;
  size: number;
  sortBy: "LATEST" | "POPULAR";
}) => {
  return useQuery({
    queryKey: ["search", type, keyword, page, size, sortBy],
    queryFn: () => search(type, keyword, page, size, sortBy),
    enabled: !!type && !!keyword,
  });
};
