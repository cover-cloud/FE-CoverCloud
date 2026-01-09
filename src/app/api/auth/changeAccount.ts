import axios from "axios";

export const useChangeAccount = (
  accessToken: string,
  nickname: string,
  profileImage: string
) => {
  const res = axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,

    { nickname, profileImage },

    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};
