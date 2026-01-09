import { Box } from "@mui/material";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Link from "next/link";

import { SlSettings } from "react-icons/sl";
import { CiFolderOn } from "react-icons/ci";
const AccountModal = ({
  openAccountModalHandler,
}: {
  openAccountModalHandler: () => void;
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "97px",
        right: "0",
        width: "323px",
        height: "217px",
        backgroundColor: "#fff",
        borderRadius: "13px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 22,
      }}
    >
      <Box className="flex justify-between" sx={{ p: 2 }}>
        <Box>마이 페이지</Box>
        <Box className="cursor-pointer" onClick={openAccountModalHandler}>
          <IoCloseSharp />
        </Box>
      </Box>
      <Box sx={{ px: 3 }}>
        <Link
          href="/mypage/account"
          className="flex items-center gap-2"
          onClick={openAccountModalHandler}
        >
          <Box>
            <SlSettings />
          </Box>
          <Box>내 계정 설정</Box>
        </Link>
        <Link
          href="/mypage/activity"
          onClick={openAccountModalHandler}
          className="flex items-center gap-2"
        >
          <Box>
            <CiFolderOn />
          </Box>
          <Box>내 활동 내역</Box>
        </Link>
      </Box>
    </Box>
  );
};

export default AccountModal;
