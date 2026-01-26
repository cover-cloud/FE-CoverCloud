import React from "react";
import { Avatar } from "@mui/material";
import { useAuthMeQuery } from "../../../app/api/auth/authMe";
import theme from "@/app/lib/theme";
import { useAuthStore } from "@/app/store/useAuthStore";
import { getProfileImage } from "@/app/utils/profileImage";
const AvatarComponent = ({
  openAccountModalHandler,
  profileImage,
}: {
  openAccountModalHandler: () => void;
  profileImage: string;
}) => {
  return (
    <Avatar
      src={profileImage}
      onClick={openAccountModalHandler}
      sx={{
        color: theme.palette.orange.primary,
        bgcolor: "transparent",
        border: `2.5px solid ${theme.palette.common.black}`,
        width: 44,
        height: 44,
      }}
    />
  );
};

export default AvatarComponent;
