"use client";

import { FunctionComponent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { createWorkflow } from "../_actions/workflow";
import WorkflowForm from "./workflow-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface WorkflowDialogProps {}

const WorkflowDialog: FunctionComponent<WorkflowDialogProps> = () => {
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateWorkFlowInputs> = async (data) => {
    const workflow = await createWorkflow(data);
    if (workflow) {
      toast({
        description: workflow.message,
        variant: workflow.error ? "destructive" : undefined,
      });
      if (!workflow.error) {
        router.refresh();
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="h-8 w-8 p-1.5">
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Workflow Automation</DialogTitle>
          <DialogDescription>
            Create a new workflow automation to automate your tasks
          </DialogDescription>
        </DialogHeader>
        <WorkflowForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDialog;
