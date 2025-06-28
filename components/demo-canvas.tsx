"use client";

import React from "react";
import ReactFlow, { Edge, Handle, Node, Position } from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, GitBranch, CheckCircle } from "lucide-react";

// Demo node component similar to EditorCanvasNode
const DemoNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.type) {
      case "trigger":
        return <Zap size={28} className="text-green-600" />;
      case "action":
        return <GitBranch size={28} className="text-blue-600" />;
      case "end":
        return <CheckCircle size={28} className="text-purple-600" />;
      default:
        return <Zap size={28} />;
    }
  };

  return (
    <div className="dark relative">
      {/* Target handle (top) - only for non-trigger nodes */}
      {data.type !== "trigger" && (
        <Handle
          type="target"
          position={Position.Top}
          className="!-top-2 !h-4 !w-4 !bg-neutral-800 !border-neutral-400"
          style={{ zIndex: 100 }}
        />
      )}

      <Card className="text-left min-w-[200px] !bg-neutral-950">
        <CardHeader className="p-4">
          <div className="flex gap-4 items-center">
            {getIcon()}
            <div>
              <CardTitle className="text-md">{data.label}</CardTitle>
              <p className="text-xs text-muted-foreground/60">
                <b className="text-muted-foreground">ID: </b>
                {data.id}
              </p>
            </div>
          </div>
          <CardDescription>{data.description}</CardDescription>
          <div className="flex gap-2 pt-1.5">
            <Badge variant="secondary" className="text-neutral-400">
              {data.category}
            </Badge>
            <Badge variant="secondary" className="text-green-500">
              Connected
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Source handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!-bottom-2 !h-4 !w-4 !bg-neutral-800 !border-neutral-400"
      />
    </div>
  );
};

const nodeTypes = {
  demo: DemoNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "demo",
    position: { x: 140, y: -80 },
    data: {
      id: "trigger-1",
      label: "Gmail Received",
      type: "trigger",
      category: "Trigger",
      description: "Triggers when a new email is received in Gmail",
    },
  },
  {
    id: "2",
    type: "demo",
    position: { x: 140, y: 130 },
    data: {
      id: "action-1",
      label: "Save to Drive",
      type: "action",
      category: "Action",
      description: "Save email attachment to Google Drive folder",
    },
  },
  {
    id: "3",
    type: "demo",
    position: { x: 163, y: 350 },
    data: {
      id: "action-2",
      label: "Send Notification",
      type: "end",
      category: "Action",
      description: "Send notification to Slack channel",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
];

const DemoCanvas = () => {
  return (
    <div className="w-[300px] h-[600px] bg-transparent overflow-hidden">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
      ></ReactFlow>
    </div>
  );
};

export default DemoCanvas;
