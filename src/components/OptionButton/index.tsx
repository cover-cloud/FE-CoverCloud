import React from "react";
import { Box } from "@mui/material";
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";

interface OptionButtonProps {
  isLogin: boolean;
  openDeleteModal: () => void;
  navigateToEdit: () => void;
  colIcon?: boolean;
}

const OptionButton = ({
  isLogin,
  openDeleteModal,
  navigateToEdit,
  colIcon = false,
}: OptionButtonProps) => {
  const [isOptionOpen, setIsOptionOpen] = React.useState(false);
  return (
    <Box
      className="flex items-start justify-center relative"
      onClick={() => setIsOptionOpen(!isOptionOpen)}
    >
      {colIcon ? <HiDotsVertical /> : <HiDotsHorizontal />}
      {isOptionOpen && isLogin && (
        <Box className="absolute top-7 right-0 bg-white w-24 border-2 border-gray-200 z-50">
          <Box className="hover:bg-gray-100 p-2" onClick={openDeleteModal}>
            삭제
          </Box>
          <Box className="hover:bg-gray-100 p-2" onClick={navigateToEdit}>
            수정
          </Box>
        </Box>
      )}
      {isOptionOpen && !isLogin && (
        <Box className="absolute top-7 right-0 bg-white w-24 border-2 border-gray-200">
          <Box className="hover:bg-gray-100 p-2">신고</Box>
        </Box>
      )}
    </Box>
  );
};

export default OptionButton;
