"use client";
import React from "react";
import { CommentData } from "./type";
import { sampleComment, sampleCommentCount } from "./type";
import { Box, Typography } from "@mui/material";
import CommentItem from "../CommentItem";
import CommentInput from "../CommentInput";
interface CommentFormInput {
  comment: string;
}

const CommentSection = () => {
  const [commentsData, setCommentsData] = React.useState<CommentData[]>([]);
  const [totalCommentCount, setTotalCommentCount] =
    React.useState(sampleCommentCount);

  const conmmentSubmitHandler = (data: string) => {
    setCommentsData((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: "user_123",
        createdAt: new Date().toISOString(),
        updatedAt: "",
        userAvatarImageUrl: "",
        userName: "John Doe",
        comment: data,
        likes: 0,
        replies: [],
      },
    ]);
  };

  React.useEffect(() => {
    setCommentsData(sampleComment);
  }, []);

  const replySubmitHandler = (data: string, parentId: string) => {
    console.log(data, "epdlxj");
    setCommentsData((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now().toString(),
                userId: "user_123",
                createdAt: new Date().toISOString(),
                updatedAt: "",
                userAvatarImageUrl: "",
                userName: "John Doe",
                comment: data,
                likes: 0,
                replies: [],
              },
            ],
          };
        }
        return comment;
      })
    );
  };

  return (
    <section>
      <Typography variant="h4">댓글 {totalCommentCount}</Typography>

      <Typography variant="h5" mb={2}>
        댓글 작성
      </Typography>
      <CommentInput onSubmit={conmmentSubmitHandler} />
      <Box className="mt-2">
        {commentsData.map((comment) => (
          <CommentItem
            key={comment.id}
            {...comment}
            onReplySubmit={(data) => replySubmitHandler(data, comment.id)}
          />
        ))}
      </Box>
    </section>
  );
};

export default CommentSection;
