import axios from "axios";

export const changeAccount = (
  accessToken: string,
  nickname: string | undefined,
  profileImage: string | null | undefined,
) => {
  const res = axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,

    { nickname, profileImage },

    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res;
};
