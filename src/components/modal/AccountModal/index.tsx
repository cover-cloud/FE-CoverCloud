import { Box } from "@mui/material";
import React from "react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { CiFolderOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";
const AccountModal = ({
  openAccountModalHandler,
}: {
  openAccountModalHandler: () => void;
}) => {
  const pathname = usePathname();
  const isAccount = pathname === "/mypage/account";
  const isActivity = pathname === "/mypage/activity";

  // const [activeLink, setActiveLink] = React.useState<string>("");
  // React.useEffect(() => {
  //   setActiveLink(isAccount || isActivity ? "account" : "activity");
  // }, [isAccount, isActivity]);

  return (
    <Box
      onClick={openAccountModalHandler}
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 21,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
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
        <Box className="flex justify-between" sx={{ px: "48px", py: "24px" }}>
          <Box sx={{ fontSize: "24px" }}>마이 페이지</Box>
          <Box
            className="cursor-pointer flex items-center"
            onClick={openAccountModalHandler}
          >
            <IoCloseSharp size={24} />
          </Box>
        </Box>
        <Box>
          <Link href="/mypage/account" onClick={openAccountModalHandler}>
            <Box
              className="flex items-center gap-2"
              sx={{
                px: "60px",
                py: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F2F2F2",
                },
              }}
            >
              <FiSettings size={24} strokeWidth={isAccount ? 2.5 : 1} />
              <Box
                sx={{
                  fontWeight: isAccount ? 700 : 400,
                }}
              >
                내 계정 설정
              </Box>
            </Box>
          </Link>

          <Link href="/mypage/activity" onClick={openAccountModalHandler}>
            <Box
              className="flex items-center gap-2"
              sx={{
                px: "60px",
                py: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F2F2F2",
                },
              }}
            >
              <CiFolderOn size={24} strokeWidth={isActivity ? 1.5 : 1} />
              <Box
                sx={{
                  fontWeight: isActivity ? 700 : 400,
                }}
              >
                내 활동 내역
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountModal;
