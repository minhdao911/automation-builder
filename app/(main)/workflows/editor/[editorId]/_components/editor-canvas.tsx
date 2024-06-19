"use client";

import { FunctionComponent, useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import EditorCanvasNode from "./editor-canvas-node";
import { WorkflowNodeType } from "@/lib/types";
import { EDITOR_DEFAULT_CARDS } from "@/lib/constants";
import EditorCanvasSidebar from "./editor-canvas-sidebar";
import { Workflow } from "@prisma/client";

interface EditorCanvasProps {
  workflow: Workflow;
}

const nodeTypes = {
  [WorkflowNodeType.Action]: EditorCanvasNode,
  [WorkflowNodeType.Trigger]: EditorCanvasNode,
  [WorkflowNodeType.Logical]: EditorCanvasNode,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    type: WorkflowNodeType.Trigger,
    data: EDITOR_DEFAULT_CARDS.Trigger[0],
  },
  {
    id: "2",
    position: { x: 150, y: 300 },
    type: WorkflowNodeType.Action,
    data: EDITOR_DEFAULT_CARDS.Action[1],
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const EditorCanvas: FunctionComponent<EditorCanvasProps> = ({ workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex h-full">
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls position="top-left" />
          <MiniMap
            position="bottom-left"
            maskColor="bg-black"
            className="!bg-background"
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <EditorCanvasSidebar workflowName={workflow.name} />
    </div>
  );
};

export default EditorCanvas;
