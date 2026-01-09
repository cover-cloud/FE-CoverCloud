"use client";
import React, { useEffect } from "react";
import { CommentData, CommentListData } from "./type";
import { sampleCommentCount } from "./type";
import { Box, Typography } from "@mui/material";
import CommentItem from "../CommentItem";
import CommentInput from "../CommentInput";
import { useCommentListQuery } from "@/app/api/cover/comment";
interface CommentFormInput {
  comment: string;
}

const CommentSection = ({ id }: { id: string }) => {
  const [commentsData, setCommentsData] = React.useState<CommentData[]>([]);
  const [totalCommentCount, setTotalCommentCount] =
    React.useState(sampleCommentCount);

  const { data: commentList } = useCommentListQuery(id);
  console.log(commentList);
  useEffect(() => {
    if (!commentList?.data) {
      setCommentsData([]);
      return;
    }
    const comments = commentList.data.map((comment: CommentListData) => ({
      id: comment.commentId.toString(),
      userId: comment.userId.toString(),
      createdAt: new Date().toISOString(), // 서버에서 없으면 임시
      updatedAt: "",
      userAvatarImageUrl: "",
      userName: "John Doe", // 서버 없으면 임시
      comment: comment.content,
      likes: 0,
      replies: comment.replies ?? [],
    }));
    setCommentsData(comments);
  }, [commentList]);
  useEffect(() => {
    console.log(commentsData, "eㅔ이터");
  }, [commentsData]);
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
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);

  const openCommentInputHandler = (id: string) => {
    setSelectedCommentId(selectedCommentId === id ? null : id);
  };
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
      <Box className="H2">댓글 {totalCommentCount}</Box>

      <CommentInput onSubmit={conmmentSubmitHandler} id={id} />
      <Box className="mt-2">
        {commentsData.length > 0
          ? commentsData.map((comment: CommentData) => (
              <CommentItem
                key={comment.id}
                parentId={id}
                {...comment}
                onReplySubmit={(data) => replySubmitHandler(data, comment.id)}
                openCommentInputHandler={openCommentInputHandler}
                openCmmentInput={selectedCommentId === comment.id}
              />
            ))
          : null}
      </Box>
    </section>
  );
};

export default CommentSection;
