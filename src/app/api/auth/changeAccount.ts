import { api } from "@/app/lib/api";
import axios from "axios";
import { completeLogin } from "@/app/utils/auth.service";
import { useAuthStore } from "@/app/store/useAuthStore";
export const changeAccount = async (
  nickname: string | undefined,
  profileImage: string | null | undefined,
) => {
  const res = await api.post(
    `/api/user/profile`,

    { nickname, profileImage },
  );
  const accessToken = useAuthStore.getState().accessToken;

  await completeLogin(accessToken);
  return res;
};

export const fetchImageUrl = async (file: File) => {
  const res = await api.post("/api/user/profile/upload-url", {
    contentType: file.type,
  });

  const { uploadUrl, objectPath } = res.data.data;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  const accessToken = useAuthStore.getState().accessToken;
  await completeLogin(accessToken);

  return objectPath;
};
