"use client";

import { useParams } from "next/navigation";
import { Box, Button, TextField, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema, FormField, SongData } from "./type";
import { useSpotifySearchQuery } from "@/app/hook/useSpotifySearchQuery";
import { useState, useEffect } from "react";
import ClientModalRender from "@/components/modal/ClientModalRender";
import { getYoutubeVideoId } from "@/app/utils/youtube";
import SelectArtistForm from "../SelectArtistForm";

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
  { key: "tag", label: "태그", placeholder: "태그 입력 후 추가 버튼 클릭" },
];

const ItemEditor = ({ mode }: { mode: "create" | "edit" }) => {
  const params = useParams();

  const { control, handleSubmit, watch, setValue } = useForm<FormSchema>({
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

  const [tags, setTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState<string>("");

  const [selectedSongData, setSelectedSongData] = useState<SongData | null>(
    null
  );

  const link = watch("link");
  const songName = watch("songName");
  const tagInput = watch("tag");

  const youtubeVideoId = getYoutubeVideoId(link);

  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) {
      alert("이미 추가된 태그입니다");
      return;
    }
    setTags([...tags, tagInput.trim()]);
    setValue("tag", "");
    setTagError("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleTagKeyDown = (
    key: string,
    e: React.KeyboardEvent,
    controllerField: any
  ) => {
    if (key !== "tag") return;
    if (e.key === "Enter") {
      e.preventDefault();

      const target = e.target as HTMLInputElement;
      const value = target.value;
      //벨류값이 직접 접근해서 바꿔줌 - > 이러면 랜더링 전에 처리가능
      controllerField.onChange(value);

      setTimeout(() => {
        handleAddTag();
      }, 0);
    }
  };
  useEffect(() => {
    console.log(selectedSongData);
  }, [selectedSongData]);
  const onSubmit = (formData: FormSchema) => {
    if (tags.length === 0) {
      setTagError("태그를 최소 1개 이상 추가해주세요");
      return;
    }
    console.log("Form Data:", { ...formData, tags });
    setTagError("");
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {fields.map((field) => (
          <Box key={field.key}>
            <Box className="flex items-center justify-between mb-1">
              <Box>{field.label}</Box>

              {field.key === "tag" && (
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  추가
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
                  onKeyDown={(e) =>
                    handleTagKeyDown(field.key, e, controllerField)
                  }
                  error={
                    !!fieldState.error ||
                    (field.key === "tag" && !!tagError) ||
                    (field.key === "link" && !!link && !youtubeVideoId)
                  }
                  helperText={
                    fieldState.error?.message ||
                    (field.key === "tag" ? tagError : "") ||
                    (field.key === "link" && !!link && !youtubeVideoId
                      ? "존재하지 않는 유튜브 URL입니다."
                      : "")
                  }
                />
              )}
            />

            {field.key === "link" && youtubeVideoId && (
              <Box className="mt-3">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </Box>
            )}
            {field.key === "songName" && songName.trim() !== "" && (
              <Box>
                <SelectArtistForm
                  searchSongName={songName}
                  selectedSongData={selectedSongData}
                  setSelectedSongData={setSelectedSongData}
                />
              </Box>
            )}
            {field.key === "tag" && tags.length > 0 && (
              <Box className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}

        <Button type="submit" variant="contained" className="mt-4">
          제출
        </Button>
      </Box>
      <ClientModalRender />
    </Box>
  );
};

export default ItemEditor;
