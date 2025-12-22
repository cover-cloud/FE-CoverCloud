import theme from "@/app/lib/theme";
import { Button } from "@mui/material";

const PostBasicButton = ({
  children,
  onClick,
  color,
  backgroundColor,
  hoverColor,
}: {
  children: string;
  onClick: () => void;
  color?: string;
  backgroundColor?: string;
  hoverColor?: string;
}) => {
  return (
    <Button
      sx={{
        padding: "8px 28px",
        borderRadius: "15px",
        backgroundColor: backgroundColor,
        color: color,
        "&:hover": {
          backgroundColor: hoverColor,
        },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PostBasicButton;
