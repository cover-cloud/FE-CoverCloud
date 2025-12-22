import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchAuthMe = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.get("http://localhost:8080/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const useAuthMeQuery = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
  });
};
