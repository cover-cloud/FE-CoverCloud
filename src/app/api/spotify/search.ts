import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const search = async (keyword: string, accessToken: string) => {
  const searchResult = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/music/spotify/search`,
    { keyword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return searchResult.data;
};

export const useSearchQuery = (keyword: string, accessToken: string) => {
  return useQuery({
    queryKey: ["spotify", keyword],
    queryFn: () => search(keyword, accessToken),
    enabled: !!keyword,
  });
};
