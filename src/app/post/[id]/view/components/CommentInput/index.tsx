import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import theme from "@/app/lib/theme";
import { useCreateComment } from "@/app/api/cover/comment";
import { useAuthStore } from "@/app/store/useAuthStore";

interface CommentInputProps {
  onSubmit: (data: string) => void;
  depth?: number;
  id: string;
  parentId?: string;
}

const CommentInput = ({
  onSubmit,
  depth = 0,
  id,
  parentId,
}: CommentInputProps) => {
  const [comment, setComment] = React.useState("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!comment.trim()) return;
    e.preventDefault();
    if (depth > 0) {
      useCreateComment({
        comment,
        coverId: id,
        parentCommentId: parentId,
        accessToken,
      });
    } else {
      useCreateComment({ comment, coverId: id, accessToken });
    }
    onSubmit(comment);
    setComment("");
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
