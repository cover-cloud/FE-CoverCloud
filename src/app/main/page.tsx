"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../components/PostCard";
import Box from "@mui/material/Box";
import { dummyPosts } from "../../data/postData";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "../../app/store/useModalStore";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const MainPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const closeLoginModal = useModalStore((state) => state.closeLoginModal);
  // 페이지네이션
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = React.useState(initialPage);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [alignment, setAlignment] = React.useState(["kpop"]);

  const toggleChangeHandler = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setAlignment(newFormats);
  };
  const modalCloseHandler = () => {
    closeLoginModal();
  };

  const pageChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    router.push(`/?page=${value}`, { scroll: false });
  };

  const tabChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSelectedTab(value);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  React.useEffect(() => {
    const currentPage = Number(searchParams.get("page") || 1);
    setPage(currentPage);
  }, [searchParams]);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* 해당 탭마다 변경되는 값 체인지시에 벨류값을 넣어서 api 호출하면 될듯 */}
        <Tabs
          value={selectedTab}
          onChange={tabChangeHandler}
          aria-label="basic tabs example"
        >
          <Tab label="월간 인기 커버곡" {...a11yProps(0)} />
          <Tab label="주간 인기 커버곡	" {...a11yProps(1)} />
          <Tab label="일간 인기 커버곡" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {/* 여기 버튼탭 만들고 버튼값도 넣음 api 호출하고 안에들어가는 포스트 값만 변경하면될듯 */}

      <ToggleButtonGroup
        value={alignment}
        onChange={toggleChangeHandler}
        aria-label="text formatting"
      >
        <ToggleButton value="bold" aria-label="bold">
          K-pop
        </ToggleButton>
        <ToggleButton value="italic" aria-label="italic">
          J-pop
        </ToggleButton>
        <ToggleButton value="underlined" aria-label="underlined">
          Pop
        </ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        {dummyPosts.map((post, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <PostCard {...post} />
          </Grid>
        ))}
      </Grid>
      <Box className="mt-8 flex justify-center">
        <Pagination
          count={10}
          page={page}
          onChange={pageChangeHandler}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default MainPage;
