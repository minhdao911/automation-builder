import { Workflow } from "@prisma/client";
import { create } from "zustand";

type WorkflowModal = {
  open: boolean;
  workflow: Workflow | null;
  setOpen: (open: boolean) => void;
  setWorkflow: (workflow: Workflow | null) => void;
};

export const useWorkflowModalStore = create<WorkflowModal>((set) => ({
  open: false,
  workflow: null,
  setOpen: (open: boolean) => set({ open }),
  setWorkflow: (workflow: Workflow | null) => set({ workflow }),
}));
