// src/app/post/[id]/view/error.tsx
"use client";
import { Button } from "@mui/material";

// 에러 컴포넌트는 반드시 클라이언트 컴포넌트여야 함

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-xl font-bold">페이지를 로드할 수 없습니다.</h2>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <Button onClick={() => reset()}>다시 시도</Button>
    </div>
  );
}
