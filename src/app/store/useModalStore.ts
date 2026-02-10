import { create } from "zustand";

interface ModalStore {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}
interface MobaileModeStore {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
// export const useMobaileModeStore = create<MobaileModeStore>((set) => ({
//   isMobile: false,
//   setIsMobile: (isMobile: boolean) => set({ isMobile }),
// }));
