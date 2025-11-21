"use client";

import { useParams } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema, FormField } from "./type";

// React Query 훅
import { useSpotifySearchQuery } from "@/app/hook/useSpotifySearchQuery";
import { useState } from "react";

const fields: FormField[] = [
  { key: "link", label: "링크", placeholder: "링크" },
  {
    key: "songName",
    label: "노래 검색",
    placeholder: "노래 검색",
    hasButton: true,
  },
  { key: "coverArtist", label: "커버 아티스트", placeholder: "커버 아티스트" },
  { key: "genre", label: "장르", placeholder: "장르" },
  { key: "title", label: "제목", placeholder: "제목" },
  { key: "tag", label: "태그", placeholder: "태그" },
];

const Page = () => {
  const params = useParams();
  const postId = params.id;

  const { control, handleSubmit, watch } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      songName: "",
      coverArtist: "",
      genre: "",
      title: "",
      tag: "",
    },
  });

  // 🔥 검색 버튼을 눌렀을 때만 실행하기 위한 상태
  const [enableSearch, setEnableSearch] = useState(false);

  const songName = watch("songName");

  // 🔥 React Query - Spotify 검색
  const { data, isFetching } = useSpotifySearchQuery(songName, enableSearch);

  // 검색 버튼 핸들러
  const handleSongSearch = () => {
    if (!songName.trim()) return;
    setEnableSearch(true); // 이때 query 실행됨

    console.log("검색 중...");
  };

  // 검색 결과 나오면 콘솔 출력
  if (data) {
    console.log("스포티파이 검색 결과:", data);
  }

  const onSubmit = (formData: FormSchema) => {
    console.log("Form Data:", formData);
  };

  return (
    <Box>
      {postId} 번 아이템
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {fields.map((field) => (
          <Box key={field.key}>
            <Box className="flex items-center justify-between mb-1">
              <Box>{field.label}</Box>

              {/* 🔥 songName만 검색 버튼 표시 */}
              {field.hasButton && (
                <Button type="button" onClick={handleSongSearch}>
                  {isFetching ? "검색 중..." : "검색"}
                </Button>
              )}
            </Box>

            <Controller
              name={field.key}
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <TextField
                  placeholder={field.placeholder}
                  fullWidth
                  {...controllerField}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
        ))}

        <Button type="submit" variant="contained" className="mt-4">
          제출
        </Button>
      </Box>
    </Box>
  );
};

export default Page;
