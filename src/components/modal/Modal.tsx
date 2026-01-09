import { Dialog, DialogContent } from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  width = "672px",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          width: width,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        style={{
          padding: "14px",
          cursor: "pointer",
        }}
      >
        <IoCloseSharp color="black" size={24} />
      </button>
    </Dialog>
  );
}
