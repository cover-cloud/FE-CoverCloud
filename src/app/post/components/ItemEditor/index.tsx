"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Box, Button, TextField, Chip, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema, FormField, SongData } from "./type";
import { useState } from "react";
import { getYoutubeVideoId } from "@/app/utils/youtube";
import {
  createPost,
  updatePost,
  PostData,
  useReadingPost,
} from "@/app/api/cover/post";
import { useRouter } from "next/navigation";
import theme from "@/app/lib/theme";
import VideoInputField from "../../[id]/edit/components/VideoInputField";
import SearchSong from "../../[id]/edit/components/SearchSong";
import ErrorMessageComponent from "../ErrorMessageComponent";
import { useAuthStore } from "@/app/store/useAuthStore";

const fields: FormField[] = [
  { key: "title", label: "제목", placeholder: "게시글의 제목을 입력해주세요." },
  { key: "link", label: "링크", placeholder: "링크" },
  {
    key: "songTitle",
    label: "노래 검색",
    placeholder: "노래 검색",
    hasButton: true,
  },

  { key: "coverArtist", label: "커버 아티스트", placeholder: "커버 아티스트" },
  { key: "genre", label: "장르", placeholder: "장르" },

  { key: "tag", label: "태그", placeholder: "태그 입력 후 추가 버튼 클릭" },
];
const genres = [
  { title: "K-POP", value: "K_POP" },
  { title: "J-POP", value: "J_POP" },
  { title: "POP", value: "POP" },
];
const ItemEditor = ({ mode }: { mode: "create" | "edit" }) => {
  const params = useParams();
  const router = useRouter();
  const songSearchWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: postData, isLoading: isPostLoading } = useReadingPost(
    params.id as string,
  );
  const { control, handleSubmit, watch, setValue, formState } =
    useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        link: "",
        songTitle: "",
        selectedSongData: {
          artist: "",
          songTitle: "",
          key: "",
          coverUrl: "",
        },
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
  // const [selectedSongData, setSelectedSongData] = useState<SongData | null>(
  //   null
  // );

  const link = watch("link");
  const songTitle = watch("songTitle");
  const tagInput = watch("tag");
  const selectedSongData = watch("selectedSongData");

  const youtubeVideoId = getYoutubeVideoId(link);

  const toggleInputMode = () => {
    setIsManualInput((prev) => !prev);
    setValue("selectedSongData", {
      artist: "",
      songTitle: "",
      key: "",
      coverUrl: "",
    });
    setValue("songTitle", "");
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
    controllerField: any,
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
    if (mode === "create") {
      const sendData: PostData = {
        videoUrl: formData.link,
        originalTitle: formData.selectedSongData.songTitle,
        originalArtist: formData.selectedSongData?.artist,
        coverArtist: formData.coverArtist,
        title: formData.title,
        genre: formData.genre,
        tags: tags,
      };
      try {
        const createResult = await createPost(sendData);

        if (createResult.success) {
          router.push("/main");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const sendData: PostData = {
        videoUrl: formData.link,
        originalTitle: formData.selectedSongData.songTitle,
        originalArtist: formData.selectedSongData?.artist,
        coverArtist: formData.coverArtist,
        title: formData.title,
        genre: formData.genre,
        tags: tags,
      };

      const updateResult = await updatePost(params.id as string, sendData);
      if (updateResult.success) {
        router.push("/main");
      }
    }

    setTagError("");
    // router.push("/main");
  };

  const selectSongHandler = (
    songData: SongData & { title: string; spotifyTrackId: string },
  ) => {
    setValue("selectedSongData", {
      key: songData?.spotifyTrackId,
      artist: songData?.artist,
      songTitle: songData?.title,
      coverUrl: songData?.coverUrl,
    });
    setIsSongSearchFocus(false);
    setValue("songTitle", "");
  };

  const songTitleFocusHandler = (key: string) => {
    if (key === "songTitle") {
      setIsSongSearchFocus(true);
    }
  };

  const songTitleBlurHandler = (key: string) => {
    if (key === "songTitle") {
      setIsSongSearchFocus(false);
    }
  };
  const songTitleManualChangeHandler = (songTitle: string, artist: string) => {
    setValue("selectedSongData", {
      key: "",
      artist: artist,
      songTitle: songTitle,
      coverUrl: "",
    });
  };
  const onClickOutside = () => {
    setIsSongSearchFocus(false);
  };

  React.useEffect(() => {
    if (mode !== "edit") return;

    if (postData) {
      setValue("title", postData.data.data.coverTitle);
      setValue("link", postData.data.data.link);
      setValue("coverArtist", postData.data.data.coverArtist);
      setValue("genre", postData.data.data.coverGenre);
      setValue("selectedSongData", {
        artist: postData.data.data.originalArtist,
        songTitle: postData.data.data.originalTitle,
        key: postData.data.data.spotifyTrackId ?? "",
        coverUrl: postData.data.data.coverUrl ?? "",
      });

      setTags(postData.data.data.tags ?? []);
    }
  }, [mode, postData]);

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
                {fieldState.error && (
                  <ErrorMessageComponent>입력필수</ErrorMessageComponent>
                )}

                {/* 노래 검색 전용 에러 */}
                {field.key === "songTitle" &&
                  formState.isSubmitted &&
                  (!selectedSongData.artist || !selectedSongData.songTitle) && (
                    <ErrorMessageComponent>입력필수</ErrorMessageComponent>
                  )}

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
              {field.key === "songTitle" ? (
                <Box
                  ref={songSearchWrapperRef}
                  onFocusCapture={() => {
                    setIsSongSearchFocus(true);
                  }}
                  onBlurCapture={(e) => {
                    if (
                      songSearchWrapperRef.current &&
                      !songSearchWrapperRef.current.contains(
                        e.relatedTarget as Node,
                      )
                    ) {
                      setIsSongSearchFocus(false);
                    }
                  }}
                  className="relative"
                >
                  <TextField
                    placeholder={field.placeholder}
                    fullWidth
                    {...controllerField}
                    slotProps={{
                      input: {
                        readOnly: isManualInput,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.gray.secondary,
                        borderRadius: "15px",
                        border: "none",
                      },
                    }}
                  />

                  <SearchSong
                    selectedSongData={selectedSongData}
                    selectSongHandler={selectSongHandler}
                    songTitle={songTitle}
                    isSongSearchFocus={isSongSearchFocus}
                    toggleInputMode={toggleInputMode}
                    isManualInput={isManualInput}
                    songTitleManualChangeHandler={songTitleManualChangeHandler}
                    onClickOutside={onClickOutside}
                  />
                </Box>
              ) : field.key === "genre" ? (
                /* 기존 genre 로직 */

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
                  // slotProps={{
                  //   input: {
                  //     readOnly: field.key === "songTitle" && isManualInput,
                  //   },
                  // }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.gray.secondary,
                      borderRadius: "15px",
                      border: "none",
                    },
                  }}
                  {...controllerField}
                  onFocus={() => songTitleFocusHandler(field.key)}
                  onKeyDown={(e) =>
                    handleTagKeyDown(field.key, e, controllerField)
                  }
                />
              )}

              {/* 노래 검색 컴포넌트 */}
              {/* {field.key === "songTitle" && (
                <SearchSong
                  selectedSongData={selectedSongData}
                  selectSongHandler={selectSongHandler}
                  songTitle={songTitle}
                  isManualInput={isManualInput}
                  isSongSearchFocus={isSongSearchFocus}
                  toggleInputMode={toggleInputMode}
                  songTitleManualChangeHandler={songTitleManualChangeHandler}
                  onClickOutside={onClickOutside}
                />
              )} */}

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
