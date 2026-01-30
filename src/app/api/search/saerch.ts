import { api } from "@/app/lib/api";
import { useQuery } from "@tanstack/react-query";
type SearchType = "title" | "tags";

const search = async (
  type: SearchType,
  keyword: string,
  page: number,
  size: number,
  sort: string,
) => {
  const endpoint =
    type === "title" ? "/api/cover/search/title" : "/api/cover/search/tags";

  const paramKey = type === "title" ? "title" : "tags";

  const res = await api.get(endpoint, {
    params: {
      [paramKey]: keyword,
      page,
      size,
      sort,
    },
  });

  return res.data;
};

export const useSearchQuery = ({
  type,
  keyword,
  page,
  size,
  sort,
}: {
  type: SearchType;
  keyword: string;
  page: number;
  size: number;
  sort: string;
}) => {
  return useQuery({
    queryKey: ["search", type, keyword, page, size, sort],
    queryFn: () => search(type, keyword, page, size, sort),
    enabled: !!type && !!keyword,
  });
};
