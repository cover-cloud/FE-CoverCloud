import { Box, Button } from "@mui/material";
import PostBasicButton from "../PostBasicButton";
import theme from "@/app/lib/theme";
interface InfoMessageProps {
  message: string;
  subMessage?: string;
  buttonText?: string;
  onClick?: () => void;
}

const InfoMessage = ({
  message,
  subMessage,
  buttonText,
  onClick,
}: InfoMessageProps) => {
  return (
    <Box
      className="flex flex-col items-center justify-center"
      sx={{ minHeight: "518px", gap: "32px" }}
    >
      <Box className="H2" sx={{ whiteSpace: "pre-line", textAlign: "center" }}>
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>
          {subMessage && subMessage.replace(/\\n/g, "\n")}
        </span>
        {message.replace(/\\n/g, "\n")}
      </Box>
      {buttonText && onClick && (
        <PostBasicButton
          onClick={onClick}
          backgroundColor={theme.palette.orange.primary}
          color={theme.palette.common.white}
          hoverBGColor={theme.palette.orange.secondary}
          hoverColor={theme.palette.common.black}
          postRadius="50px"
          sxStyle={{
            fontWeight: "bold",
          }}
          postClass="H3"
        >
          {buttonText}
        </PostBasicButton>
      )}
    </Box>
  );
};

export default InfoMessage;
