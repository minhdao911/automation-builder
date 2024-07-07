import { Workflow } from "@prisma/client";
import { create } from "zustand";

type WorkflowModal = {
  open: boolean;
  workflow: Workflow | null;
  setOpen: (open: boolean) => void;
  setWorkflow: (workflow: Workflow) => void;
};

export const useWorkflowModalStore = create<WorkflowModal>((set) => ({
  open: false,
  workflow: null,
  setOpen: (open: boolean) => set({ open }),
  setWorkflow: (workflow: Workflow) => set({ workflow }),
}));
