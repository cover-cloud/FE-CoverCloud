"use client";
import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import theme from "@/app/lib/theme";
import { useCreateCommentMutation } from "@/app/api/cover/comment";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useModalStore } from "@/app/store/useModalStore";

interface CommentInputProps {
  onSubmit: (data: string) => void;
  depth?: number;
  id: number;
  parentId?: number | null;
}

const CommentInput = ({
  onSubmit,
  depth = 0,
  id,
  parentId,
}: CommentInputProps) => {
  const [comment, setComment] = React.useState("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const createMutation = useCreateCommentMutation();

  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    //로그인 상태 확인로직
    const isMyAccount = await fetchAuthMeWithCookie(accessToken);
    if (!isMyAccount.success) {
      openLoginModal();
      return;
    }

    onSubmit(comment);
    setComment("");
    if (parentId) {
      createMutation.mutate(
        {
          comment,
          coverId: id,
          parentCommentId: parentId,
          accessToken,
        },
        {
          onSuccess: () => {
            useSnackbarStore
              .getState()
              .show("댓글이 등록되었습니다.", "success");
          },
          onError: () => {
            useSnackbarStore
              .getState()
              .show("댓글등록에 실패했습니다.", "error");
          },
        },
      );
    } else {
      createMutation.mutate(
        { comment, coverId: id, accessToken },
        {
          onSuccess: () => {
            useSnackbarStore
              .getState()
              .show("댓글이 등록되었습니다.", "success");
          },
          onError: () => {
            useSnackbarStore
              .getState()
              .show("댓글등록에 실패했습니다.", "error");
          },
        },
      );
    }
  };
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const userAvatarImageUrl = "";
  const userName = "";
  return (
    <Box>
      <Box
        className={`flex justify-end items-center gap-2 ${
          depth > 0 ? "ml-[32px]" : ""
        }`}
        component="form"
        onSubmit={(e) => handleSubmit(e)}
        mb={2}
      >
        <Box className="relative w-[36px] h-[36px] flex-shrink-0 rounded-full overflow-hidden">
          {isImageLoading || userAvatarImageUrl ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              className="absolute inset-0"
            />
          ) : (
            <Image
              src={userAvatarImageUrl}
              alt={userName}
              fill
              sizes="(max-width: 768px) 48px, 52px"
              style={{ objectFit: "cover", borderRadius: 4 }}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          )}
        </Box>
        <TextField
          label="댓글을 입력하세요"
          fullWidth
          multiline
          variant="standard"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          type="submit"
          sx={{
            mt: 1,
            backgroundColor: theme.palette.common.black,
            color: "white",
            borderRadius: "20px",
            "&:disabled": {
              backgroundColor: theme.palette.gray.primary,
              color: "white",
            },
            "&:hover": {
              backgroundColor: theme.palette.gray.fourth,
            },
          }}
          disabled={!comment.trim()}
        >
          <Box className="S3">작성</Box>
        </Button>
      </Box>
    </Box>
  );
};

export default CommentInput;
