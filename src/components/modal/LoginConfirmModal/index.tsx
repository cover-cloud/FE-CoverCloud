import Login from "@/components/auth/Login";
import { Box } from "@mui/material";
import Modal from "../Modal";

const LoginConfirmModal = () => {
  return (
    <Modal isOpen onClose={() => {}}>
      <Box>로그인이 필요한 서비스 입니다.</Box>
      <Login />
    </Modal>
  );
};

export default LoginConfirmModal;
