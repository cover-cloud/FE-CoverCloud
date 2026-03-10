"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Chip,
  MenuItem,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Modal from "@/components/modal/Modal";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, formSchema, FormField, SongData } from "./type";
import { useState } from "react";
import {
  detectAndValidateMediaUrl,
  fetchSoundCloudDataWithApi,
  fetchTiktokDataWithApi,
  getYoutubeVideoId,
  MediaUrlResult,
} from "@/app/utils/youtube";
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
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import Login from "@/components/auth/Login";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
import { isValid } from "zod/v3";

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
  { title: "기타", value: "OTHER" },
];
const ItemEditor = ({ mode }: { mode: "create" | "edit" }) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { openLoginModal } = useModalStore();
  const songSearchWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading: authMeLoading,
    error: authMeError,
  } = useAuthMeQuery();
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
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormSchema | null>(
    null,
  );

  const [isSongSearchFocus, setIsSongSearchFocus] = useState(false);
  // const [selectedSongData, setSelectedSongData] = useState<SongData | null>(
  //   null
  // );
  const [videoUrl, setVideoUrl] = useState<MediaUrlResult>({
    platform: null,
    id: null,
    isValid: false,
    originalUrl: "",
  });
  const [isVideoUrlLoading, setIsVideoUrlLoading] = useState(false);

  const link = watch("link");
  const songTitle = watch("songTitle");
  const tagInput = watch("tag");
  const selectedSongData = watch("selectedSongData");

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
    if (mode === "edit") {
      setPendingFormData(formData);
      setIsEditConfirmOpen(true);
      return;
    }

    await executeSubmit(formData);
  };

  const executeSubmit = async (formData: FormSchema) => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);
    if (!isAuthenticated.success) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 추천할 수 있습니다.", "error");
      return;
    }

    const sendData: PostData = {
      videoUrl: formData.link,
      originalTitle: formData.selectedSongData.songTitle,
      originalArtist: formData.selectedSongData?.artist,
      originalCoverImageUrl: formData.selectedSongData?.coverUrl,
      coverArtist: formData.coverArtist,
      title: formData.title,
      genre: formData.genre,
      tags: tags,
    };

    if (mode === "create") {
      try {
        const createResult = await createPost(sendData);
        if (createResult.success) {
          router.push("/main");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const updateResult = await updatePost(params.id as string, sendData);
      if (updateResult.success) {
        router.push(`/post/${params.id}/view`);
      }
    }

    setTagError("");
  };

  const handleEditConfirm = async () => {
    setIsEditConfirmOpen(false);
    if (pendingFormData) {
      await executeSubmit(pendingFormData);
      setPendingFormData(null);
    }
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
    const validate = async () => {
      setIsVideoUrlLoading(true);
      if (!link) {
        setVideoUrl({
          platform: null,
          id: null,
          isValid: false,
          originalUrl: "",
        });
        return;
      }

      // 우선 기존 동기 함수로 감지
      let result = detectAndValidateMediaUrl(link);

      // 틱톡인데 단축 URL인 경우 (embedUrl이 없는 경우) 비동기 처리
      if (result.platform === "tiktok" && !result.embedUrl) {
        // 이전에 만든 비동기 API 호출 함수 사용
        const tiktokData = await fetchTiktokDataWithApi(link);
        if (tiktokData && tiktokData.realId) {
          result = {
            ...result,
            id: tiktokData.realId,
            isValid: true,
            embedUrl: tiktokData.embedUrl,
          };
        }
      }
      if (result.platform === "soundcloud" && !result.embedUrl) {
        const soundcloudData = await fetchSoundCloudDataWithApi(link);
        result = {
          ...result,
          id: soundcloudData?.realId,
          isValid: true,
          embedUrl: soundcloudData?.embedUrl,
        };
      }
      console.log(result);
      setVideoUrl(result);
      setIsVideoUrlLoading(false);
    };

    validate();
  }, [link]);
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

  if (data?.success === false) return <Login />;
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4"
      sx={{ width: isMobile ? "100%" : "70%", mx: "auto" }}
    >
      {authMeLoading ? (
        <Box
          className="mt-8"
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={64}
            sx={{ color: theme.palette.orange.primary }}
          />
        </Box>
      ) : data?.data?.success === false ? (
        <Box>
          <Login />
        </Box>
      ) : (
        <React.Fragment>
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
                      (!selectedSongData.artist ||
                        !selectedSongData.songTitle) && (
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
                        songTitleManualChangeHandler={
                          songTitleManualChangeHandler
                        }
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
                      youtubeVideoId={videoUrl.embedUrl}
                      videoType={videoUrl.platform}
                      isVideoUrlLoading={isVideoUrlLoading}
                      isMobile={isMobile}
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
              {mode === "create" ? "커버곡 추천하기" : "수정하기"}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Modal
        isOpen={isEditConfirmOpen}
        onClose={() => {
          setIsEditConfirmOpen(false);
          setPendingFormData(null);
        }}
      >
        <Box
          className="flex flex-col items-center"
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "12px",
            p: "40px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            게시글 수정
          </Typography>
          <Typography sx={{ fontSize: "20px", color: "#666", mb: "24px" }}>
            게시글을 수정하시겠습니까?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setIsEditConfirmOpen(false);
                setPendingFormData(null);
              }}
            >
              취소
            </Button>
            <Button variant="contained" onClick={handleEditConfirm}>
              수정
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ItemEditor;
