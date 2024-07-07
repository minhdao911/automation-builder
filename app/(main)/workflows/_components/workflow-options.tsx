"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { FunctionComponent } from "react";
import { Button } from "@/components/ui/button";
import { useWorkflowModalStore } from "@/stores/workflow-modal-store";
import { deleteWorkflow } from "../_actions/workflow";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Workflow } from "@prisma/client";

interface WorkflowOptionsProps {
  workflow: Workflow;
}

const WorkflowOptions: FunctionComponent<WorkflowOptionsProps> = ({
  workflow,
}) => {
  const { setOpen, setWorkflow } = useWorkflowModalStore();
  const router = useRouter();

  const handleDelete = async () => {
    const response = await deleteWorkflow(workflow.id);
    if (response) {
      toast({
        description: response.message,
        variant: response.error ? "destructive" : undefined,
      });
      if (!response.error) {
        router.refresh();
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Ellipsis size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42" align="end">
        <DropdownMenuItem
          onClick={() => {
            setWorkflow(workflow);
            setOpen(true);
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkflowOptions;
