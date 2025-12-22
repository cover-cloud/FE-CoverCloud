import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCoverList = async (page: number, size: number) => {
  const res = await axios.get(`http://localhost:8080/api/cover/list`, {
    params: { page, size },
  });
  return res.data.data;
};

export const useCoverListQuery = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: ["cover-list", page, size],
    queryFn: () => fetchCoverList(page, size),
    // staleTime: 1000 * 60,
  });
};
