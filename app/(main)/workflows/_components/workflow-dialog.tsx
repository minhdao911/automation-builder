"use client";

import { FunctionComponent, useState } from "react";
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
import { Workflow } from "@prisma/client";

interface WorkflowDialogProps {
  trigger?: React.ReactNode;
  workflow?: Workflow;
}

const WorkflowDialog: FunctionComponent<WorkflowDialogProps> = ({
  trigger,
  workflow,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<CreateWorkFlowInputs> = async (data) => {
    let wf;
    if (workflow) {
      wf = await updateWorkflowDetails(data, workflow.id);
    } else {
      wf = await createWorkflow(data);
    }
    if (wf) {
      toast({
        description: wf.message,
        variant: wf.error ? "destructive" : undefined,
      });
      if (!wf.error) {
        router.refresh();
      }
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
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
