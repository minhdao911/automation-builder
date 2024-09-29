"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { Workflow } from "@prisma/client";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { publishWorkflow, saveWorkflow } from "../_actions/editor";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  WorkflowNode,
  WorkflowNodeDataSchema,
  WorkflowNodeSchema,
} from "@/model/types";
import { identity, pickBy } from "lodash";
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

const WorkflowNodeDataSchemaForComparison = WorkflowNodeDataSchema.omit({
  selected: true,
});

const EditorNavbar: FunctionComponent<EditorNavbarProps> = ({ workflow }) => {
  const { nodes, edges } = useEditorStore();
  // const [isPending, startTransition] = useTransition();
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isSavePending, setIsSavePending] = useState(false);
  const [isPublishPending, setIsPublishPending] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkIfDataChanged = useCallback(() => {
    const oldData = {
      nodes: workflow.nodes ? JSON.parse(workflow.nodes) : null,
      edges: workflow.edges ? JSON.parse(workflow.edges) : null,
    };
    if (oldData.nodes) {
      oldData.nodes = oldData.nodes.map((node: WorkflowNode) =>
        pickBy(WorkflowNodeDataSchemaForComparison.parse(node.data), identity)
      );
    }
    const currentData = {
      nodes:
        nodes.length > 0
          ? nodes.map((node) =>
              pickBy(
                WorkflowNodeDataSchemaForComparison.parse(node.data),
                identity
              )
            )
          : null,
      edges: edges.length > 0 ? edges : null,
    };
    return JSON.stringify(oldData) !== JSON.stringify(currentData);
  }, [nodes, edges, workflow]);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    interval = setInterval(() => {
      const changed = checkIfDataChanged();
      setIsDataChanged(changed);
    }, 5000);
    return () => clearInterval(interval);
  }, [checkIfDataChanged]);

  const handleSave = async () => {
    const nodesToSave = nodes.map((node) => WorkflowNodeSchema.parse(node));
    setIsSavePending(true);
    const isSaved = await saveWorkflow(workflow.id, {
      nodes: nodesToSave,
      edges,
    });
    toast({
      description: isSaved
        ? "Workflow saved successfully"
        : "Failed to save workflow",
      variant: isSaved ? undefined : "destructive",
    });
    setIsDataChanged(false);
    if (searchParams.get("error")) {
      router.replace(pathname);
    }
    router.refresh();
    setIsSavePending(false);
  };

  const handlePublish = async () => {
    setIsPublishPending(true);
    const state = !workflow.published;
    const isDone = await publishWorkflow(workflow.id, state);
    toast({
      description: isDone
        ? `Workflow ${state ? "published" : "is set to draft"} successfully`
        : `Failed to ${state} ? "publish workflow" : "set to draft"}`,
      variant: isDone ? undefined : "destructive",
    });
    router.refresh();
    setIsPublishPending(false);
  };

  return (
    <div className="flex items-center justify-between dark:bg-black px-4 py-4 w-full">
      <div className="flex items-center gap-4">
        <GoBackButton checkIfDataChanged={checkIfDataChanged} />
        <div>
          <p className="text-sm text-neutral-500">Workflow</p>
          <h3 className="text-lg font-semibold">{workflow.name}</h3>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        {isDataChanged && (
          <p className="text-sm text-neutral-400">You have unsaved changes</p>
        )}
        <Button
          size="sm"
          variant="secondary"
          className="w-[60px]"
          onClick={handleSave}
        >
          {isSavePending ? <Loader size={16} /> : "Save"}
        </Button>
        <Button size="sm" onClick={handlePublish}>
          {isPublishPending ? (
            <Loader size={16} />
          ) : workflow.published ? (
            "Set to draft"
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorNavbar;

interface GoBackButtonProps {
  checkIfDataChanged: () => boolean;
}

const GoBackButton = ({ checkIfDataChanged }: GoBackButtonProps) => {
  const router = useRouter();
  const { nodes, selectedNode, setNodes, setEdges, updateNode } =
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
              googleDrive: undefined,
            },
          });
        }
      }
    }
  };

  const handleGoBack = () => {
    const isDataChanged = checkIfDataChanged();
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
