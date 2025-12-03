import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { CommentData } from "../CommentSection/type";
import { FaRegComment, FaRegHeart } from "react-icons/fa";

interface CommentItemProps extends CommentData {
  depth?: number; // 뎁스 정보 추가
}

const CommentItem = ({
  userAvatarImageUrl,
  userName,
  comment,
  likes,
  createdAt,
  updatedAt,
  replies,
  depth = 0,
}: CommentItemProps) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [showReplies, setShowReplies] = React.useState(false); // 대댓글 토글 상태

  const size = Math.max(48 - depth * 12, 24);

  const handleToggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <Box className={`mb-2`} ml={depth * 4}>
      <Box className="flex gap-2 items-start flex-col">
        <Box className="flex gap-2">
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
              <Box>{comment}</Box>
            </Box>

            <Box className="flex gap-2 mt-1">
              <Box className="flex items-center gap-1">
                <FaRegHeart /> {likes}
              </Box>

              {depth < 1 && replies.length > 0 && (
                <Box
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleToggleReplies} // 클릭 시 토글
                >
                  <FaRegComment /> {replies.length}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* 대댓글 */}
        {showReplies && replies.length > 0 && (
          <Box className="mt-2">
            {replies.map((reply) => (
              <CommentItem key={reply.id} {...reply} depth={depth + 1} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentItem;
