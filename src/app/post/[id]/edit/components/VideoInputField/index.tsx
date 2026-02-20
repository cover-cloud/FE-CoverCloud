import { Box, Typography } from "@mui/material";
import theme from "@/app/lib/theme";
import { TextField } from "@mui/material";
import { CgAdd } from "react-icons/cg";
import { FormField } from "../../../../components/ItemEditor/type";
import React from "react";
import { MediaPlatform } from "@/app/utils/youtube";

const VideoInputField = ({
  field,
  controllerField,
  fieldState,
  link,
  youtubeVideoId,
  videoType,
  isVideoUrlLoading,
}: {
  field: FormField;
  controllerField: any;
  fieldState: any;
  link: string;
  youtubeVideoId: string | undefined;
  videoType: MediaPlatform;
  isVideoUrlLoading: boolean;
}) => {
  return (
    <React.Fragment>
      {!youtubeVideoId ? (
        <Box
          className="flex flex-col items-center justify-center gap-4"
          sx={{
            backgroundColor:
              fieldState.error ||
              (field.key === "link" &&
                !!link &&
                !youtubeVideoId &&
                !isVideoUrlLoading)
                ? theme.palette.danger.primary
                : theme.palette.gray.tertiary,
            height: 379,
            borderRadius: "15px",
          }}
        >
          <Box className="flex items-center gap-2">
            <CgAdd />
            <Box sx={{ fontSize: "20px" }}>
              추천하고 싶은 커버곡 영상 링크를 아래에 입력해주세요.
            </Box>
          </Box>
          <TextField
            placeholder={field.placeholder}
            sx={{
              width: "80%",
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.gray.secondary,
                borderRadius: "15px",
                border: "none",
              },
            }}
            {...controllerField}
            error={
              !!fieldState.error ||
              (field.key === "link" &&
                !!link &&
                !youtubeVideoId &&
                !isVideoUrlLoading)
            }
            helperText={
              fieldState.error?.message ||
              (field.key === "link" &&
              !!link &&
              !youtubeVideoId &&
              !isVideoUrlLoading
                ? "유튜브 / 틱톡 / 사운드클라우드 링크만 첨부 가능합니다."
                : "")
            }
            slotProps={{
              formHelperText: {
                sx: {
                  fontSize: "20px",
                  color:
                    fieldState.error ||
                    (field.key === "link" &&
                      !!link &&
                      !youtubeVideoId &&
                      !isVideoUrlLoading)
                      ? theme.palette.danger.primary
                      : theme.palette.gray.primary,
                  textAlign: "center",
                },
              },
            }}
          />
        </Box>
      ) : (
        <Box>
          <TextField
            placeholder={field.placeholder}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.gray.secondary,
                borderRadius: "15px",
                border: "none",
              },
            }}
            {...controllerField}
            error={
              !!fieldState.error ||
              (field.key === "link" &&
                !!link &&
                !youtubeVideoId &&
                !isVideoUrlLoading)
            }
          />
          <Box className="mt-3">
            <iframe
              width="100%"
              style={{
                minHeight:
                  videoType === "youtube" || videoType === "tiktok"
                    ? "505px"
                    : "200px",
              }}
              src={youtubeVideoId}
              className="rounded-lg"
              allowFullScreen
            />
          </Box>
        </Box>
      )}
      <Box className="flex justify-center mt-4">
        <Typography>
          저작권에 위배되는 영상은 사전 고지 없이 삭제될 수 있으니 주의
          바랍니다.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default VideoInputField;
