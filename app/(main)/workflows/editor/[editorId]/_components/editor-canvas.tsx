"use client";

import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  ReactFlowInstance,
} from "reactflow";
import EditorCanvasNode from "./editor-canvas-node";
import { WorkflowNodeData, WorkflowNodeType } from "@/lib/types";
import EditorCanvasSidebar from "./editor-canvas-sidebar";
import { Workflow } from "@prisma/client";
import { EDITOR_DEFAULT_NODES } from "@/lib/constants";
import { v4 } from "uuid";

import "reactflow/dist/style.css";
import { useToast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/stores/editor-store";
import { loadWorkflowData } from "../_actions/editor";
import Loader from "@/components/loader";

interface EditorCanvasProps {
  workflow: Workflow;
}

const nodeTypes = {
  [WorkflowNodeType.Action]: EditorCanvasNode,
  [WorkflowNodeType.Trigger]: EditorCanvasNode,
  [WorkflowNodeType.Logical]: EditorCanvasNode,
};

const EditorCanvas: FunctionComponent<EditorCanvasProps> = ({ workflow }) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deselectNodes,
  } = useEditorStore();

  useEffect(() => {
    startTransition(async () => {
      const data = await loadWorkflowData(workflow.id);
      setEdges(data.edges);
      setNodes(data.nodes);
    });
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const getNodeFromDefaultList = (
    nodeType: WorkflowNodeType,
    nodeDataId: string
  ) => EDITOR_DEFAULT_NODES[nodeType].find((node) => node.id === nodeDataId);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const id = event.dataTransfer.getData("nodeDataId");
      const type = event.dataTransfer.getData("nodeType");
      if (!id || !type) return;

      const isTriggerNode = type === WorkflowNodeType.Trigger;
      const isTriggerExisted = nodes.find(
        (node) => node.type === WorkflowNodeType.Trigger
      );
      if (isTriggerNode && isTriggerExisted) {
        toast({
          description: "Trigger node already exists",
        });
        return;
      }

      if (!reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 120,
        y: event.clientY - 60,
      });

      const nodeData = getNodeFromDefaultList(type as WorkflowNodeType, id);
      if (!nodeData) return;

      const newNode: Node<WorkflowNodeData> = {
        id: v4(),
        type: type as WorkflowNodeType,
        position,
        data: nodeData,
      };

      setNodes([...nodes, newNode]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlowInstance, nodes]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onCanvasClick = (event: any) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("react-flow__pane")) {
      deselectNodes();
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-full h-full flex items-center justify-center">
        {isPending ? (
          <Loader />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={onCanvasClick}
          >
            <Controls position="top-left" />
            <MiniMap
              position="bottom-left"
              maskColor="bg-black"
              className="!bg-background"
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
      <EditorCanvasSidebar workflow={workflow} />
    </div>
  );
};

export default EditorCanvas;
