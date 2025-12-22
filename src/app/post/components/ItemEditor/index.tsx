"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Box, Button, TextField, Chip, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema, FormField, SongData } from "./type";
import { useState } from "react";
import { getYoutubeVideoId } from "@/app/utils/youtube";
import { createPost, updatePost, PostData } from "@/app/api/cover/post";
import { useRouter } from "next/navigation";
import theme from "@/app/lib/theme";
import VideoInputField from "../../[id]/edit/components/VideoInputField";
import SearchSong from "../../[id]/edit/components/SearchSong";
import ErrorMessageComponent from "../ErrorMessageComponent";

const fields: FormField[] = [
  { key: "title", label: "제목", placeholder: "게시글의 제목을 입력해주세요." },
  { key: "link", label: "링크", placeholder: "링크" },
  {
    key: "songName",
    label: "노래 검색",
    placeholder: "노래 검색",
    hasButton: true,
  },

  { key: "coverArtist", label: "커버 아티스트", placeholder: "커버 아티스트" },
  { key: "genre", label: "장르", placeholder: "장르" },

  { key: "tag", label: "태그", placeholder: "태그 입력 후 추가 버튼 클릭" },
];
const genres = [
  { title: "K-POP", value: "K-POP" },
  { title: "J-POP", value: "J-POP" },
  { title: "POP", value: "POP" },
];
const ItemEditor = ({ mode }: { mode: "create" | "edit" }) => {
  const params = useParams();
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      songName: "",
      songNameManual: { songName: "", artist: "" },
      coverArtist: "",
      genre: "",
      title: "",
      tag: "",
    },
  });

  const [isManualInput, setIsManualInput] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState<string>("");

  const [isSongSearchFocus, setIsSongSearchFocus] = useState(false);
  const [selectedSongData, setSelectedSongData] = useState<SongData | null>(
    null
  );
  const [songNameManualError, setSongNameManualError] =
    useState<boolean>(false);
  const [songNameError, setSongNameError] = useState<boolean>(false);
  const link = watch("link");
  const songName = watch("songName");
  const tagInput = watch("tag");

  const youtubeVideoId = getYoutubeVideoId(link);

  const toggleInputMode = () => {
    setIsManualInput((prev) => !prev);
    setSelectedSongData(null);
    setValue("songName", "");
    setValue("songNameManual", { songName: "", artist: "" });
  };

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
      const value = (e.target as HTMLInputElement).value;
      controllerField.onChange(value);
      setTimeout(() => handleAddTag(), 0);
    }
  };

  const onSubmit = async (formData: FormSchema) => {
    // if (tags.length === 0) {
    //   setTagError("태그를 최소 1개 이상 추가해주세요");
    //   return;
    // }
    console.log("tlfgod");
    const songNameError = songNameErrorHandler(formData);
    if (!songNameError) return;

    if (mode === "create") {
      const postData: PostData = {
        videoUrl: formData.link,
        originalTitle:
          selectedSongData?.songName || formData.songNameManual.songName,
        originalArtist:
          selectedSongData?.artist || formData.songNameManual.artist,
        coverArtist: formData.coverArtist,
        title: formData.title,
        genre: formData.genre,
        tags: tags,
      };
      try {
        const createResult = await createPost(postData);

        if (createResult.success) {
          router.push("/main");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // updatePost(postData);
    }

    setTagError("");
    router.push("/main");
  };
  const songNameErrorHandler = (formData: FormSchema) => {
    if (isManualInput && formData.songNameManual.artist.trim() === "") {
      setSongNameManualError(true);
      return false;
    } else if (!isManualInput && formData.songName.trim() === "") {
      setSongNameError(true);
      return false;
    }
    return true;
  };
  const selectSongHandler = (songData: SongData | null) => {
    setSelectedSongData(songData);
    setIsSongSearchFocus(false);
    setValue("songName", "");
  };

  const songNameFocusHandler = (key: string) => {
    if (key === "songName") {
      setIsSongSearchFocus(true);
    }
  };

  const songNameBlurHandler = (key: string) => {
    if (key === "songName") {
      setIsSongSearchFocus(false);
    }
  };
  const songNameManualChangeHandler = (songName: string, artist: string) => {
    setValue("songNameManual", { songName, artist });
  };
  const onClickOutside = () => {
    setIsManualInput(false);
    setIsSongSearchFocus(false);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4"
    >
      {fields.map((field) => (
        <Controller
          key={field.key}
          name={field.key}
          control={control}
          render={({ field: controllerField, fieldState }) => (
            <Box className="mb-4 relative">
              {/* 레이블과 에러 */}
              <Box className="flex items-center justify-between mb-1">
                <Box className="flex items-center gap-3">
                  <Box fontSize={20}>{field.label}</Box>

                  {(field.key === "songName" && songNameError) ||
                    (field.key === "songNameManual" && songNameManualError) ||
                    (fieldState.error && (
                      <ErrorMessageComponent>
                        {/* {fieldState.error
                      ? fieldState.error.message || "입력필수"
                      : ""} */}
                        입력필수
                      </ErrorMessageComponent>
                    ))}
                </Box>
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

              {/* 입력 필드 */}
              {field.key === "genre" ? (
                <TextField
                  select
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.gray.secondary,
                      borderRadius: "15px",
                      border: "none",
                    },
                  }}
                  {...controllerField}
                  value={controllerField.value ?? ""}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) =>
                      selected ? (
                        genres.find((g) => g.value === selected)?.title
                      ) : (
                        <span style={{ color: "#9CA3AF" }}>장르 선택</span>
                      ),
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre.value} value={genre.value}>
                      {genre.title}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field.key === "link" ? (
                <VideoInputField
                  field={field}
                  controllerField={controllerField}
                  fieldState={fieldState}
                  link={link}
                  youtubeVideoId={youtubeVideoId}
                />
              ) : (
                <TextField
                  placeholder={field.placeholder}
                  fullWidth
                  disabled={field.key === "songName" && isManualInput}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.gray.secondary,
                      borderRadius: "15px",
                      border: "none",
                    },
                  }}
                  {...controllerField}
                  onFocus={() => songNameFocusHandler(field.key)}
                  onKeyDown={(e) =>
                    handleTagKeyDown(field.key, e, controllerField)
                  }
                />
              )}

              {/* 노래 검색 컴포넌트 */}
              {field.key === "songName" && (
                <SearchSong
                  selectedSongData={selectedSongData}
                  selectSongHandler={selectSongHandler}
                  songName={songName}
                  isManualInput={isManualInput}
                  isSongSearchFocus={isSongSearchFocus}
                  toggleInputMode={toggleInputMode}
                  songNameManualChangeHandler={songNameManualChangeHandler}
                  onClickOutside={onClickOutside}
                />
              )}

              {/* 태그 렌더링 */}
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
          )}
        />
      ))}

      {/* 제출 버튼 */}
      <Box className="flex justify-center">
        <Button
          type="submit"
          sx={{
            width: "196px",
            fontSize: "20px",
            backgroundColor: theme.palette.orange.primary,
            color: theme.palette.common.white,
            borderRadius: "25px",
            "&:hover": {
              backgroundColor: theme.palette.orange.secondary,
              color: theme.palette.common.black,
            },
          }}
        >
          커버곡 추천하기
        </Button>
      </Box>
    </Box>
  );
};

export default ItemEditor;
