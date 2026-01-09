import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
