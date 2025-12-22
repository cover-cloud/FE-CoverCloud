import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const search = async (keyword: string) => {
  const accessToken = localStorage.getItem("accessToken");
  const searchResult = await axios.post(
    `http://localhost:8080/api/music/spotify/search`,
    { keyword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return searchResult.data;
};

export const useSearchQuery = (keyword: string) => {
  return useQuery({
    queryKey: ["spotify", keyword],
    queryFn: () => search(keyword),
    enabled: !!keyword,
  });
};
