import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { dummyPosts } from "@/data/postData";
import PostCard from "@/components/PostCard";
const PopularVideos = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const tabChangeHandler = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* 해당 탭마다 변경되는 값 체인지시에 벨류값을 넣어서 api 호출하면 될듯 */}
        <Tabs
          value={selectedTab}
          onChange={tabChangeHandler}
          aria-label="basic tabs example"
        >
          <Tab label="최신" {...a11yProps(0)} />
          <Tab label="일간" {...a11yProps(1)} />
          <Tab label="주간" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box>
        {dummyPosts.map((post, idx) => (
          <PostCard {...post} key={idx} isViewer />
        ))}
      </Box>
    </Box>
  );
};

export default PopularVideos;
