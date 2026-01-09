"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import theme from "@/app/lib/theme";
import InfoMessage from "@/components/InfoMessage";
const ActivityPage = () => {
  const activityTabs = ["추천", "좋아요", "댓글"];
  const [selectedTab, setSelectedTab] = React.useState(0);
  const activityTabChangeHandler = (e: React.MouseEvent, index: number) => {
    setSelectedTab(index);
  };
  const activityTabSx = (index: number) => {
    return {
      color:
        index === selectedTab
          ? theme.palette.common.black
          : theme.palette.gray.primary,
      borderRadius: "10px",
      minWidth: "60px",
      minHeight: "32px",
      padding: "0",

      "&:hover": {
        backgroundColor: theme.palette.gray.secondary,
      },
    };
  };

  return (
    <Box>
      <Box className="H1" sx={{ width: "100%", textAlign: "center" }}>
        내 활동 내역
      </Box>
      <Box>
        {activityTabs.map((tab, index) => (
          <Button
            key={tab}
            role="tab"
            aria-selected={selectedTab === index}
            onClick={(e) => activityTabChangeHandler(e, index)}
            sx={activityTabSx(index)}
          >
            <Box className="B1">{tab}</Box>
          </Button>
        ))}
        <InfoMessage
          message="아직 추천한 곡이 없습니다.\n새로운 곡을 추천하시겠어요?"
          buttonText="게시물 작성하기"
          onClick={() => {}}
        />
      </Box>
    </Box>
  );
};

export default ActivityPage;
