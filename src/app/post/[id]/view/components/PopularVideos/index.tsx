"use client";
import React from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";
import PostCard from "@/components/PostCard";
import { Period, usePopularCoverListQuery } from "@/app/api/cover/list";
import theme from "@/app/lib/theme";
import { contentData } from "@/app/main/type";

type PopularTab = {
  title: string;
  value: number;
  period: Period;
};
const PopularVideos = () => {
  const popularTabs: PopularTab[] = [
    { title: "전체", value: 0, period: "ALL" },
    { title: "월간", value: 1, period: "MONTHLY" },
    { title: "일간", value: 2, period: "DAILY" },
    { title: "주간", value: 3, period: "WEEKLY" },
  ];
  const [selectedTab, setSelectedTab] = React.useState<PopularTab>({
    title: "전체",
    value: 0,
    period: "ALL",
  });

  const { data, isLoading, error } = usePopularCoverListQuery({
    page: 0,
    size: 10,
    period: selectedTab.period,
  });

  const popularTabChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: PopularTab,
  ) => {
    setSelectedTab(value);
  };

  const popularTabSx = (index: number) => {
    return {
      color:
        index === selectedTab.value
          ? theme.palette.common.black
          : theme.palette.gray.primary,
      borderRadius: "10px",
      minWidth: "60px",
      minHeight: "32px",
      padding: "0",
      fontSize: "20px",
      marginLeft: index === 0 || index === 1 ? "0" : "12px",

      "&:hover": {
        backgroundColor: theme.palette.gray.secondary,
      },
    };
  };
  return (
    <Box>
      <Box role="tablist" className="flex items-center mb-4">
        {popularTabs.map((tab, index) => (
          <Box key={index} className="flex items-center">
            <Button
              role="tab"
              aria-selected={selectedTab.period === tab.period}
              onClick={(e) => popularTabChangeHandler(e, tab)}
              sx={popularTabSx(index)}
            >
              {tab.title}
            </Button>
            {index === 0 && (
              <Box
                sx={{
                  width: "1px",
                  height: "14px",
                  backgroundColor: theme.palette.common.black,
                  marginLeft: "12px",
                  marginRight: "12px",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      <Box>
        {data?.content.map((post: contentData, idx: number) => (
          <PostCard {...post} key={idx} isViewer />
        ))}
      </Box>
    </Box>
  );
};

export default PopularVideos;
