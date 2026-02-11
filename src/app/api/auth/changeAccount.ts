import { api } from "@/app/lib/api";
import axios from "axios";
import { refreshToken } from "./refresh";
export const changeAccount = async (
  nickname: string | undefined,
  profileImage: string | null | undefined,
) => {
  const res = await api.post(
    `/api/user/profile`,

    { nickname, profileImage },
  );
  await refreshToken();
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
  await refreshToken();

  return objectPath;
};
