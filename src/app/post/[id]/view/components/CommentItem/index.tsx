import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { CommentData } from "../CommentSection/type";
import { FaComment, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { FaArrowTurnDown, FaArrowTurnUp } from "react-icons/fa6";
import CommentInput from "../CommentInput";
import theme from "@/app/lib/theme";

interface CommentItemProps extends CommentData {
  depth?: number; // 뎁스 정보 추가
  onReplySubmit?: (data: string, id: string) => void;
  openCmmentInput?: boolean;
  openCommentInputHandler?: (id: string) => void;
  parentId?: string;
}

const CommentItem = ({
  id,
  userAvatarImageUrl,
  userName,
  comment,
  likes,
  createdAt,
  parentId,
  replies,
  depth = 0,
  onReplySubmit,
  openCmmentInput,
  openCommentInputHandler,
}: CommentItemProps) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const [liked, setLiked] = React.useState(false);
  const size = Math.max(48 - depth * 12, 24);

  return (
    <Box className={`mb-2`} ml={depth * 2}>
      <Box className="flex gap-2 items-start flex-col">
        <Box className="flex gap-2">
          {depth > 0 && (
            <Box>
              <Box className="rotate-90 transform mt-3">
                <FaArrowTurnUp size={16} />
              </Box>
            </Box>
          )}
          <Box
            className="relative flex-shrink-0 rounded-full overflow-hidden"
            width={size}
            height={size}
          >
            {isImageLoading || !userAvatarImageUrl ? (
              <Skeleton
                variant="circular"
                width="100%"
                height="100%"
                className="absolute inset-0"
              />
            ) : (
              <Image
                src={userAvatarImageUrl}
                alt={userName}
                fill
                sizes={`${size}px`}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            )}
          </Box>

          <Box>
            <Box>
              <Box className="flex justify-between">
                <Box fontWeight="bold">{userName}</Box>
                <Box>{createdAt}</Box>
              </Box>
              <Typography sx={{ whiteSpace: "pre-line" }}>{comment}</Typography>
            </Box>

            <Box className="flex gap-2 mt-1">
              <Button
                className="flex items-center gap-1 cursor-pointer"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.gray.secondary,
                  },
                }}
                onClick={() => setLiked(!liked)}
              >
                {liked ? <FaHeart /> : <FaRegHeart />} {likes}
              </Button>

              {depth < 1 && (
                <Button
                  className="flex items-center gap-1 cursor-pointer"
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.gray.secondary,
                    },
                  }}
                  onClick={() => openCommentInputHandler?.(id)} // 클릭 시 토글
                >
                  {openCmmentInput ? <FaComment /> : <FaRegComment />}{" "}
                  {replies.length}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* 대댓글 */}
        {openCmmentInput && (
          <Box className="mt-2 w-full">
            <CommentInput
              onSubmit={(data) => onReplySubmit?.(data, id)}
              depth={depth + 1}
              id={id}
              parentId={parentId}
            />
          </Box>
        )}
        {replies.length > 0 &&
          replies.map((reply) => (
            <Box key={reply.id}>
              <CommentItem key={reply.id} {...reply} depth={depth + 1} />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default CommentItem;
