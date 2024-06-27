"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { Workflow } from "@prisma/client";
import { FunctionComponent, useTransition } from "react";
import { saveWorkflow } from "../_actions/editor";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface EditorNavbarProps {
  workflow: Workflow;
}

const EditorNavbar: FunctionComponent<EditorNavbarProps> = ({ workflow }) => {
  const { nodes, edges, setNodes, setEdges } = useEditorStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between dark:bg-black px-4 py-4 w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="p-1.5 rounded-full"
          onClick={() => {
            router.push("/workflows");
            setTimeout(() => {
              setNodes([]);
              setEdges([]);
            }, 1000);
          }}
        >
          <ArrowLeft size={24} />
        </Button>
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
          onClick={() => {
            startTransition(async () => {
              const isSaved = await saveWorkflow(workflow.id, {
                nodes: JSON.stringify(nodes),
                edges: JSON.stringify(edges),
              });
              toast({
                description: isSaved
                  ? "Workflow saved successfully"
                  : "Failed to save workflow",
                variant: isSaved ? undefined : "destructive",
              });
            });
          }}
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
