"use client";
import Login from "../../auth/Login";
import Modal from "../Modal";
import { useModalStore } from "../../../app/store/useModalStore";
const ClientModalRender = () => {
  const { isLoginModalOpen } = useModalStore();
  const closeLoginModal = useModalStore((state) => state.closeLoginModal);
  const modalCloseHandler = () => {
    closeLoginModal();
  };
  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={modalCloseHandler}
      width={"672px"}
    >
      <Login />
    </Modal>
  );
};

export default ClientModalRender;
