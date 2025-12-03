"use client";
import React from "react";
import { CommentData } from "./type";
import { sampleComment, sampleCommentCount } from "./type";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import CommentItem from "../CommentItem";
interface CommentFormInput {
  comment: string;
}

const CommentSection = () => {
  const [commentsData, setCommentsData] = React.useState<CommentData[]>([]);
  const [totalCommentCount, setTotalCommentCount] =
    React.useState(sampleCommentCount);

  const { register, handleSubmit, reset, watch } = useForm<CommentFormInput>({
    defaultValues: { comment: "" },
  });

  // 대댓글 입력 상태를 댓글 id별로 관리
  const [replyInputs, setReplyInputs] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    setCommentsData(sampleComment);
  }, []);

  const onSubmit: SubmitHandler<CommentFormInput> = (data) => {
    console.log("작성된 댓글:", data.comment);
    reset();
  };

  return (
    <section>
      <Typography variant="h4">댓글 {totalCommentCount}</Typography>

      <Typography variant="h5" mb={2}>
        댓글 작성
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={2}>
        <TextField
          {...register("comment", { required: true })}
          label="댓글을 입력하세요"
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          작성
        </Button>
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">
          실시간 입력 값: {watch("comment")}
        </Typography>
      </Box>

      <Box className="mt-2">
        {commentsData.map((comment) => (
          <CommentItem key={comment.id} {...comment} />
        ))}
      </Box>
    </section>
  );
};

export default CommentSection;
