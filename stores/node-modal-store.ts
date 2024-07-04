import { create } from "zustand";

type NodeModal = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useNodeModalStore = create<NodeModal>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
