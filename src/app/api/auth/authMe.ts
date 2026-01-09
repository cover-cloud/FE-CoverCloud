import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchAuthMeWithCookie = async (accessToken: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );

  return res.data;
};

export const useAuthMeQuery = (accessToken: string) => {
  return useQuery({
    queryKey: ["auth-me-cookie"],
    queryFn: () => fetchAuthMeWithCookie(accessToken),
  });
};
