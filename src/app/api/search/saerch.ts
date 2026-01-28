import { api } from "@/app/lib/api";
import { useQuery } from "@tanstack/react-query";

const fetchSearch = async (title: string, page: number, size: number) => {
  try {
    const res = await api.get(`/api/cover/search/title`, {
      params: {
        title,
        page,
        size,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const useSearchQuery = (title: string, page: number, size: number) => {
  return useQuery({
    queryKey: ["search", title],
    queryFn: () => fetchSearch(title, page, size),
    enabled: !!title,
  });
};
