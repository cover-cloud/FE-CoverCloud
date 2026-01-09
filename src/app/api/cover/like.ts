import axios from "axios";

export const fetchLike = async (coverId: string) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cover/${coverId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
