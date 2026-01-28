import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
const search = async (keyword: string) => {
  const searchResult = await api.post(`/api/music/spotify/search`, { keyword });
  return searchResult.data;
};

export const useSearchQuery = (keyword: string) => {
  return useQuery({
    queryKey: ["spotify", keyword],
    queryFn: () => search(keyword),
    enabled: !!keyword,
  });
};
