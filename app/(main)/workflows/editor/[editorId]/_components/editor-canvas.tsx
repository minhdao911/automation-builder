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
  Connection,
  Controls,
  MiniMap,
  Node,
  ReactFlowInstance,
} from "reactflow";
import EditorCanvasNode from "./editor-canvas-node";
import {
  Workflow,
  WorkflowConnectorEnriched,
  WorkflowNodeData,
} from "@/model/types";
import EditorCanvasSidebar from "./editor-canvas-sidebar";
import { ConnectorNodeType } from "@prisma/client";
import { v4 } from "uuid";

import "reactflow/dist/style.css";
import { useToast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/stores/editor-store";
import Loader from "@/components/ui/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useNodeModalStore } from "@/stores/node-modal-store";
import EditorCanvasNodeSettings from "./editor-canvas-node-settings";
import CustomEdge from "./custom-edge";
import { getUsageLimit } from "../../../_actions/workflow";

interface EditorCanvasProps {
  workflow: Workflow;
  connectors: WorkflowConnectorEnriched[];
}

const nodeTypes = {
  [ConnectorNodeType.Action]: EditorCanvasNode,
  [ConnectorNodeType.Trigger]: EditorCanvasNode,
  [ConnectorNodeType.Logical]: EditorCanvasNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const EditorCanvas: FunctionComponent<EditorCanvasProps> = ({
  workflow,
  connectors,
}) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setTriggerNode,
    setVariables,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deselectNodes,
  } = useEditorStore();
  const { setOpen } = useNodeModalStore();

  useEffect(() => {
    // make sure modal is closed when workflow is loaded
    setOpen(false);

    startTransition(async () => {
      const { nodes, edges, variables, triggerNode } = workflow;
      setEdges(edges);
      setNodes(nodes);
      setVariables(variables);
      setTriggerNode(triggerNode);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const getNodeFromDefaultList = (
    nodeType: ConnectorNodeType,
    nodeDataId: string
  ) =>
    connectors.find(
      (node) => node.id === nodeDataId && node.nodeType === nodeType
    );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const id = event.dataTransfer.getData("nodeDataId");
      const type = event.dataTransfer.getData("nodeType");
      if (!id || !type) return;

      if (
        !workflow.usage.unlimited &&
        nodes.length === workflow.usage.nodeLimit
      ) {
        toast({
          description: "Maximum number of nodes reached",
        });
        return;
      }

      const isTriggerNode = type === ConnectorNodeType.Trigger;
      const isTriggerExisted = nodes.find(
        (node) => node.type === ConnectorNodeType.Trigger
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

      const nodeData = getNodeFromDefaultList(type as ConnectorNodeType, id);
      if (!nodeData) return;

      const newNode: Node<WorkflowNodeData> = {
        id: v4(),
        type: type as ConnectorNodeType,
        position,
        data: nodeData,
      };

      setNodes([...nodes, newNode]);
      if (isTriggerNode) {
        setTriggerNode(newNode);
      }
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
      setOpen(false);
    }
  };

  const onNodeConnect = (connection: Connection) => {
    const edgesOfSource = edges.filter(
      (edge) => edge.source === connection.source
    );
    if (edgesOfSource.length === 2) {
      toast({
        description: "One node has maximum 2 connections",
      });
    } else {
      onConnect(connection);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <EditorCanvasSidebar connectors={connectors} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="w-full h-full flex items-center justify-center">
          {isPending ? (
            <Loader />
          ) : (
            <>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onInit={onInit}
                onConnect={onNodeConnect}
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
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={12}
                  size={1}
                />
              </ReactFlow>
              <EditorCanvasNodeSettings />
            </>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorCanvas;
