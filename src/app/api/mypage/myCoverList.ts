import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const myCoverList = async (accessToken: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/my`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const useMyCoverListQuery = (accessToken: string) => {
  return useQuery({
    queryKey: ["myCoverList"],
    queryFn: () => myCoverList(accessToken),
  });
};
