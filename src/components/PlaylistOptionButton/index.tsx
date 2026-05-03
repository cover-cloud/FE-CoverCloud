import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { HiDotsHorizontal, HiDotsVertical } from "react-icons/hi";

interface PlaylistOptionButtonProps {
  isLogin: boolean;
  openDeleteModal: () => void;
  navigateToEdit: () => void;
  colIcon?: boolean;
  isCenter?: boolean;
}

const PlaylistOptionButton = ({
  isLogin,
  openDeleteModal,
  navigateToEdit,
  colIcon = false,
  isCenter = false,
}: PlaylistOptionButtonProps) => {
  const [isOptionOpen, setIsOptionOpen] = React.useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔹 밖 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOptionOpen(false);
      }
    };

    if (isOptionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptionOpen]);

  return (
    <Box
      ref={wrapperRef}
      className={`flex ${isCenter ? "items-center" : "items-start"} justify-center relative`}
    >
      {/* 버튼 클릭 */}
      <Box
        onClick={(e) => {
          e.stopPropagation();
          setIsOptionOpen((prev) => !prev);
        }}
      >
        {colIcon ? <HiDotsVertical /> : <HiDotsHorizontal size={24} />}
      </Box>

      {isOptionOpen && isLogin && (
        <Box className="absolute top-7 right-0 bg-white w-[180px] border-2 border-gray-200 z-50">
          <Box
            className="hover:bg-gray-100 p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigateToEdit();
              setIsOptionOpen(false);
            }}
          >
            이름 변경
          </Box>
          <Box
            className="hover:bg-gray-100 p-2"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal();
              setIsOptionOpen(false);
            }}
          >
            플레이리스트 삭제
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlaylistOptionButton;
