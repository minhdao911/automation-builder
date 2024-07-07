"use client";

import { FunctionComponent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitHandler } from "react-hook-form";
import { CreateWorkFlowInputs } from "@/lib/types";
import { createWorkflow, updateWorkflowDetails } from "../_actions/workflow";
import WorkflowForm from "./workflow-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useWorkflowModalStore } from "@/stores/workflow-modal-store";

interface WorkflowDialogProps {
  trigger?: React.ReactNode;
}

const WorkflowDialog: FunctionComponent<WorkflowDialogProps> = ({
  trigger,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { open, setOpen, workflow } = useWorkflowModalStore();

  const onSubmit: SubmitHandler<CreateWorkFlowInputs> = async (data) => {
    let response;
    if (workflow) {
      response = await updateWorkflowDetails(data, workflow.id);
    } else {
      response = await createWorkflow(data);
    }
    if (response) {
      toast({
        description: response.message,
        variant: response.error ? "destructive" : undefined,
      });
      if (!response.error) {
        router.refresh();
      }
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Workflow Automation</DialogTitle>
          <DialogDescription>
            Create a new workflow automation to automate your tasks
          </DialogDescription>
        </DialogHeader>
        <WorkflowForm
          name={workflow?.name}
          description={workflow?.description}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDialog;
