import { create } from "zustand";


type State = {
  isOpen: boolean;
  body: JSX.Element | null
}

type Action = {
  openModal: (body: JSX.Element) => void
  closeModal: () => void
}

const useModalStore = create<State & Action>(
  (set) => ({
    isOpen: false,
    body: null,
    
    openModal: (body: JSX.Element) => {
      set({ isOpen: true, body });
    },
    closeModal: () => {
      set({ isOpen: false, body: null });
    }
    })
)

export default useModalStore;