"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useModalStore } from "../app/store/useModalStore";
import { Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";

// 컴포넌트
import Login from "../components/auth/Login";
import Modal from "../components/modal/Modal";
import PostCard from "../components/PostCard";
import Box from "@mui/material/Box";
import { dummyPosts } from "../data/postData";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 모달전역상태
  const { isLoginModalOpen } = useModalStore();
  const closeLoginModal = useModalStore((state) => state.closeLoginModal);
  // 페이지네이션
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = React.useState(initialPage);

  const modalCloseHandler = () => {
    closeLoginModal();
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    router.push(`/?page=${value}`, { scroll: false });
  };

  React.useEffect(() => {
    const currentPage = Number(searchParams.get("page") || 1);
    setPage(currentPage);
  }, [searchParams]);

  return (
    <Box>
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
          onChange={handleChange}
          color="primary"
        />
      </Box>

      <Modal isOpen={isLoginModalOpen} onClose={modalCloseHandler}>
        <Login />
      </Modal>
    </Box>
  );
}
