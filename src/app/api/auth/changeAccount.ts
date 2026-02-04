import { api } from "@/app/lib/api";

export const changeAccount = (
  nickname: string | undefined,
  profileImage: string | null | undefined,
) => {
  const res = api.post(
    `/api/user/profile`,

    { nickname, profileImage },
  );
  return res;
};
