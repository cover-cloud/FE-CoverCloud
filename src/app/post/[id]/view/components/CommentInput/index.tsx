import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { IoIosSend } from "react-icons/io";

interface CommentInputProps {
  onSubmit: (data: string) => void;
  depth?: number;
}

const CommentInput = ({ onSubmit, depth = 0 }: CommentInputProps) => {
  const [comment, setComment] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!comment.trim()) return;
    console.log(comment);
    e.preventDefault();
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
          variant="contained"
          sx={{ mt: 1 }}
          disabled={!comment.trim()}
        >
          <IoIosSend />
        </Button>
      </Box>
    </Box>
  );
};

export default CommentInput;
