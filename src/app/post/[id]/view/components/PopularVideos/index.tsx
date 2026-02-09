"use client";
import React from "react";
import { Box, Tabs, Tab, Button, Grid } from "@mui/material";
import PostCard from "@/components/PostCard";
import { Period, usePopularCoverListQuery } from "@/app/api/cover/list";
import theme from "@/app/lib/theme";
import { contentData } from "@/app/main/type";
import { is } from "zod/v4/locales";

type PopularTab = {
  title: string;
  value: number;
  period: Period;
};
const PopularVideos = ({ isViewer }: { isViewer: boolean }) => {
  const popularTabs: PopularTab[] = [
    { title: "최신", value: 0, period: "ALL" },
    { title: "일간", value: 1, period: "MONTHLY" },
    { title: "주간", value: 2, period: "DAILY" },
    { title: "월간", value: 3, period: "WEEKLY" },
  ];
  const [selectedTab, setSelectedTab] = React.useState<PopularTab>({
    title: "최신",
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
              <Box className="S1">{tab.title}</Box>
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
      <Grid container spacing={2}>
        {data?.content.map((post: contentData, idx: number) => (
          <Grid
            key={idx}
            size={
              isViewer
                ? { xs: 12 } // 뷰어 모드 → 항상 한 줄
                : { xs: 12, sm: 6, md: 4 } // 일반 모드
            }
          >
            <PostCard {...post} key={idx} isViewer={isViewer} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularVideos;
