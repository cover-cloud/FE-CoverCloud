"use client";
import React, { useEffect, useRef } from "react";

import theme from "../../../app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";
import Modal from "@/components/modal/Modal";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useAuthMeQuery } from "@/app/api/auth/authMe";
import { getProfileImage } from "@/app/utils/profileImage";
import { changeAccount, fetchImageUrl } from "@/app/api/auth/changeAccount";
import { logout } from "@/app/api/auth/logout";
import { useRouter } from "next/navigation";

import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { TbCirclePlus } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSnackbarStore } from "@/app/store/useSnackbar";

import Login from "@/components/auth/Login";
import Loading from "@/app/main/loading";

const AccountPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openNickNameModal, setOpenNickNameModal] = React.useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    React.useState(false);

  const [openImageConfirmModal, setOpenImageConfirmModal] =
    React.useState(false);

  const [tempAvatar, setTempAvatar] = React.useState<string | null>(null);
  const [prevAvatar, setPrevAvatar] = React.useState<string>("");

  const [isImageChanging, setIsImageChanging] = React.useState(false);

  const [avatar, setAvatar] = React.useState<string>("");
  const [originalNickName, setOriginalNickName] = React.useState<string>("");
  const [newNickName, setNewNickName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [accessedSNS, setAccessedSNS] = React.useState<string>("");

  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading } = useAuthMeQuery();

  const accountSx = {
    "& .MuiInputBase-input": {
      padding: "12px 20px",
    },
    "&.MuiFormControl-root": {
      flex: 1,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray.secondary,
      borderRadius: "15px",
      border: "none",
      height: isMobile ? "40px" : "48px",
    },
  };
  const hasImage = typeof avatar === "string" && avatar.length > 0;
  const handleImageChange = async (file: File) => {
    setOpenImageConfirmModal(true);
    try {
      const result = await fetchImageUrl(file);

      if (result) {
        const tempAvatarUrl = `https://storage.googleapis.com/covercloud-bucket/${result}`;
        setTempAvatar(tempAvatarUrl);
        setAvatar(tempAvatarUrl);
      }
    } catch {
      useSnackbarStore.getState().show("이미지 변경에 실패했습니다.", "error");
    }
  };
  const handleRemoveImage = async () => {
    try {
      const result = await changeAccount(undefined, "");

      if (result.data.success) {
        setAvatar("");
        setPrevAvatar("");
        useSnackbarStore.getState().show("이미지가 삭제되었습니다.", "success");
      }
    } catch {
      useSnackbarStore.getState().show("이미지 삭제에 실패했습니다.", "error");
    }
  };

  const changedNickNameHandler = async () => {
    try {
      const result = await changeAccount(newNickName, undefined);

      if (result.data.success) {
        setOriginalNickName(newNickName);
        setNewNickName("");
        setOpenNickNameModal(false);

        useSnackbarStore.getState().show("닉네임이 변경되었습니다.", "success");
      }
    } catch {
      useSnackbarStore.getState().show("닉네임 변경에 실패했습니다.", "error");
    }
  };

  const openDeleteAccountModalHandler = () => {
    setIsDeleteAccountModalOpen(true);
  };
  const deleteAccountHandler = () => {
    // TODO: 계정 삭제 API 호출
    setIsDeleteAccountModalOpen(false);
  };
  const logoutHandler = async () => {
    // TODO: 로그아웃 API 호출
    const result = await logout(accessToken);
    if (result.success) {
      useAuthStore.setState({ accessToken: "" });
      useAuthStore.setState({ isLogin: false });
      useSnackbarStore.getState().show("로그아웃되었습니다.", "success");
      router.push("/");
    } else {
      useSnackbarStore.getState().show("로그아웃에 실패했습니다.", "error");
    }
  };
  const changedImageHandler = async () => {
    if (!tempAvatar) return;

    try {
      setIsImageChanging(true);

      const result = await changeAccount(undefined, tempAvatar);

      if (result.data.success) {
        setAvatar(tempAvatar);
        setPrevAvatar(tempAvatar);
        setTempAvatar(null);
        setOpenImageConfirmModal(false);

        useSnackbarStore
          .getState()
          .show("프로필 이미지가 변경되었습니다.", "success");
      } else {
        throw new Error("change failed");
      }
    } catch (e) {
      useSnackbarStore
        .getState()
        .show("프로필 이미지 변경에 실패했습니다.", "error");
    } finally {
      setIsImageChanging(false);
    }
  };

  useEffect(() => {
    if (!data || data.success === false) return;
    const avatar = getProfileImage(data?.data.profileImage);
    setAvatar(avatar);
    setPrevAvatar(avatar);
    setOriginalNickName(data.data.nickname);
    setAccessedSNS(data.data.provider);
  }, [data]);
  if (isLoading) return <Loading />;
  if (data?.success === false) return <Login />;
  return (
    <Box
      className="flex flex-col gap-4"
      sx={{ width: isMobile ? "100%" : "70%", mx: "auto" }}
    >
      <Box sx={{ fontSize: 24, fontWeight: "bold", mb: 4 }}>내 계정 설정</Box>

      <Box className="flex flex-col gap-1 items-center justify-center">
        {/* Avatar 영역 */}
        <Box sx={{ position: "relative", width: 200, height: 200 }}>
          <Avatar
            sx={{ width: 200, height: 200 }}
            src={hasImage ? avatar : undefined}
          />

          {/* 업로드 오버레이 */}
          <Box
            className="absolute inset-0 flex items-center justify-center"
            sx={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "rgba(108,98,98,0.2)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              opacity: hasImage ? 0 : 1,
              transition: "opacity 0.2s ease",
              "&:hover": { opacity: 1 },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Box
              className="flex items-center justify-center"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `2px solid ${theme.palette.common.white}`,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <TbCirclePlus size={70} color="#fff" />
            </Box>
          </Box>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                handleImageChange(file);
              };
              reader.readAsDataURL(file);
            }}
          />
        </Box>

        <Button
          onClick={handleRemoveImage}
          size="large"
          sx={{
            alignSelf: "center",
            gap: 0.5,
            color: theme.palette.common.black,
            fontSize: "18px",
          }}
        >
          <FaRegTrashAlt />
          <span style={{ marginLeft: "4px" }}>이미지 삭제</span>
        </Button>
      </Box>

      {/* 닉네임 */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          닉네임
        </Typography>
        <Box className="flex gap-4 items-center">
          <TextField
            value={originalNickName}
            onChange={(e) => setNewNickName(e.target.value)}
            placeholder="닉네임"
            disabled
            sx={accountSx}
          />

          <Box className="flex items-center">
            <PostBasicButton
              onClick={() => setOpenNickNameModal(true)}
              backgroundColor={theme.palette.common.black}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.gray.secondary}
              hoverColor={theme.palette.common.black}
              sxStyle={{
                minWidth: isMobile ? "64px" : "126px",
                flex: 1,
              }}
              postClass={` ${isMobile ? "S4" : "B1"}`}
            >
              변경
            </PostBasicButton>
          </Box>
        </Box>
      </Box>
      {/* 이메일 */}

      {accessedSNS !== "KAKAO" && (
        <Box className="flex flex-col gap-1">
          <Typography variant="h6" sx={{ minWidth: 80 }}>
            이메일
          </Typography>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            fullWidth
            disabled
            sx={accountSx}
          />
        </Box>
      )}
      {/* SNS */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          SNS
        </Typography>
        <TextField
          value={accessedSNS}
          onChange={(e) => setAccessedSNS(e.target.value)}
          placeholder="SNS"
          fullWidth
          disabled
          sx={accountSx}
        />
      </Box>
      {/* 계정관리 */}
      <Box className="flex flex-col gap-1">
        <Typography variant="h6" sx={{ minWidth: 80 }}>
          계정관리
        </Typography>
        <Box
          className="flex flex-col justify-center items-center"
          sx={{ gap: "12px" }}
        >
          <PostBasicButton
            backgroundColor={theme.palette.common.black}
            color={theme.palette.common.white}
            hoverBGColor={theme.palette.gray.secondary}
            hoverColor={theme.palette.common.black}
            postRadius="50px"
            onClick={logoutHandler}
            sxStyle={{
              marginBottom: "24px",
            }}
            postClass="B1"
          >
            계정 로그아웃
          </PostBasicButton>
          <Box className="flex items-center gap-2 B1">
            <Box>회원 탈퇴가 필요하다면 ‘계정 삭제’를 눌러주세요.</Box>
            <Button
              onClick={openDeleteAccountModalHandler}
              sx={{
                textDecoration: "underline",

                color: theme.palette.common.black,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Box className="B1" sx={{ flex: "1 0 auto" }}>
                계정삭제
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      {/* 닉네임수정모달 */}
      <Modal
        isOpen={openNickNameModal}
        onClose={() => setOpenNickNameModal(false)}
      >
        <Box
          className="flex flex-col gap-4 items-center"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            height: "449px",
            borderRadius: "8px",
            padding: isMobile ? "30px" : "50px",
          }}
        >
          <Box className="H1">닉네임 변경</Box>
          <Box className="S2" sx={{ width: "100%" }}>
            현재 닉네임
          </Box>
          <TextField
            value={originalNickName}
            onChange={(e) => setOriginalNickName(e.target.value)}
            placeholder="현재 닉네임"
            fullWidth
            sx={accountSx}
            disabled
          />
          <Box className="S2" sx={{ width: "100%" }}>
            새 닉네임
          </Box>
          <TextField
            value={newNickName}
            onChange={(e) => setNewNickName(e.target.value)}
            placeholder="새 닉네임"
            fullWidth
            sx={accountSx}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <PostBasicButton
              onClick={changedNickNameHandler}
              backgroundColor={theme.palette.orange.primary}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.orange.secondary}
              hoverColor={theme.palette.common.black}
              sxStyle={{
                fontWeight: "bold",
              }}
            >
              닉네임 변경하기
            </PostBasicButton>
          </Box>
        </Box>
      </Modal>
      {/* 삭제모달 */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      >
        <Box sx={{ minWidth: "637px", p: 2 }}>
          <Box
            className="flex flex-col gap-4 items-center"
            sx={{ width: "80%", margin: "auto" }}
          >
            <Box className="">계정 삭제</Box>
            <Box
              className=""
              sx={{
                width: "100%",
                backgroundColor: theme.palette.gray.secondary,
                borderRadius: "15px",
                minHeight: "140px",
                maxHeight: "409px",
                padding: "20px",
                overflowY: "scroll",
              }}
            >
              <Box>
                계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른
                모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한
                작성글, 댓글, 좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정
                탈퇴 시 해당 계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든
                기록은 즉시 폐기됩니다. 작성글, 댓글, 좋아요를 누른 모든 기록은
                즉시 폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다. 계정 탈퇴 시 해당
                계정으로 작성한 작성글, 댓글, 좋아요를 누른 모든 기록은 즉시
                폐기됩니다. 계정 탈퇴 시 해당 계정으로 작성한 작성글, 댓글,
                좋아요를 누른 모든 기록은 즉시 폐기됩니다.
              </Box>
            </Box>
            <Box className="text-center" sx={{ mt: "48px", mb: "24px" }}>
              위 안내사항을 모두 확인하였으며,
              <br /> 이에 동의 후 계정 삭제를 진행합니다.
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 1, mb: "60px" }}>
              <PostBasicButton
                onClick={deleteAccountHandler}
                backgroundColor={theme.palette.common.black}
                color={theme.palette.common.white}
                hoverBGColor={theme.palette.gray.secondary}
                hoverColor={theme.palette.common.black}
                postRadius="50px"
                postClass="H1"
                sxStyle={{
                  padding: "12px 38px",
                }}
              >
                계정 탈퇴하기
              </PostBasicButton>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        isOpen={openImageConfirmModal}
        onClose={() => {
          setOpenImageConfirmModal(false);
          setTempAvatar(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <Box className="flex flex-col gap-4 items-center" sx={{ p: 3 }}>
          <Box className="H1">프로필 이미지 변경</Box>

          <Avatar
            src={tempAvatar || undefined}
            sx={{ width: 160, height: 160 }}
          />

          <Box className="B1 text-center">
            해당 이미지로 프로필을 변경하시겠습니까?
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              onClick={changedImageHandler}
              variant="contained"
              disabled={isImageChanging}
            >
              {isImageChanging ? "변경 중..." : "변경"}
            </Button>

            <Button
              onClick={() => {
                setAvatar(prevAvatar);
                setTempAvatar(null);
                setOpenImageConfirmModal(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              variant="outlined"
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccountPage;
