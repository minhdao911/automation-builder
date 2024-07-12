"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { Workflow } from "@prisma/client";
import { FunctionComponent, useState, useTransition } from "react";
import { saveWorkflow } from "../_actions/editor";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WorkflowNodeSchema } from "@/lib/types";
import { isEqual } from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditorNavbarProps {
  workflow: Workflow;
}

const EditorNavbar: FunctionComponent<EditorNavbarProps> = ({ workflow }) => {
  const { nodes, edges } = useEditorStore();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      const nodesToSave = nodes.map((node) => WorkflowNodeSchema.parse(node));
      const isSaved = await saveWorkflow(workflow.id, {
        nodes: JSON.stringify(nodesToSave),
        edges: JSON.stringify(edges),
      });
      toast({
        description: isSaved
          ? "Workflow saved successfully"
          : "Failed to save workflow",
        variant: isSaved ? undefined : "destructive",
      });
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between dark:bg-black px-4 py-4 w-full">
      <div className="flex items-center gap-4">
        <GoBackButton workflow={workflow} />
        <div>
          <p className="text-sm text-neutral-500">Workflow</p>
          <h3 className="text-lg font-semibold">{workflow.name}</h3>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="secondary"
          className="w-[60px]"
          onClick={handleSave}
        >
          {isPending ? <Loader size={16} /> : "Save"}
        </Button>
        <Button size="sm" className="w-[75px]">
          Publish
        </Button>
      </div>
    </div>
  );
};

export default EditorNavbar;

interface GoBackButtonProps {
  workflow: Workflow;
}

const GoBackButton = ({ workflow }: GoBackButtonProps) => {
  const router = useRouter();
  const { nodes, edges, selectedNode, setNodes, setEdges, updateNode } =
    useEditorStore();

  const [open, setOpen] = useState(false);

  const goBack = () => {
    router.push("/workflows");
    setTimeout(() => {
      setNodes([]);
      setEdges([]);
    }, 1000);
  };

  const removeListeners = async () => {
    for (const node of nodes) {
      const driveData = node.data?.metadata?.googleDrive;
      if (driveData) {
        const response = await fetch("/api/drive-activity", {
          method: "DELETE",
          body: JSON.stringify({
            channelId: driveData!.channelId,
            resourceId: driveData!.resourceId,
          }),
        });
        if (response.status === 200) {
          updateNode(selectedNode!.id, {
            metadata: {
              ...selectedNode!.data.metadata,
              googleDrive: null,
            },
          });
        }
      }
    }
  };

  const handleGoBack = () => {
    const oldData = {
      nodes: workflow.nodes ? JSON.parse(workflow.nodes) : null,
      edges: workflow.edges ? JSON.parse(workflow.edges) : null,
    };
    const currentData = {
      nodes:
        nodes.length > 0
          ? nodes.map((node) => WorkflowNodeSchema.parse(node))
          : null,
      edges: edges.length > 0 ? edges : null,
    };
    const isDataChanged = !isEqual(oldData, currentData);
    if (isDataChanged) {
      setOpen(true);
    } else {
      goBack();
    }
  };

  const handleContinue = async () => {
    await removeListeners();
    goBack();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="p-1.5 rounded-full"
        onClick={handleGoBack}
      >
        <ArrowLeft size={24} />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            Continue will remove the changes that you have made
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
