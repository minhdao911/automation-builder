"use client";

import { Button } from "@/components/ui/button";
import WorkflowDialog from "./workflow-dialog";
import { Plus } from "lucide-react";
import { useWorkflowModalStore } from "@/stores/workflow-modal-store";

const WorkflowAddButton = () => {
  const { setWorkflow } = useWorkflowModalStore();

  return (
    <WorkflowDialog
      trigger={
        <Button
          size="sm"
          className="h-8 w-8 p-1.5 bg-[#7540A9] hover:bg-[#8057a9] dark:bg-primary"
          onClick={() => setWorkflow(null)}
        >
          <Plus size={24} />
        </Button>
      }
    />
  );
};

export default WorkflowAddButton;
