import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import StatusDot from "@/components/ui/status-dot";
import { ConnectorDataType, Workflow } from "@prisma/client";
import { Node } from "reactflow";
import { WorkflowNodeData } from "@/lib/types";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { Minus } from "lucide-react";
import WorkflowOptions from "./workflow-options";

type Props = {
  workflow: Workflow;
};

const getConnections = (nodes: string | null) => {
  if (!nodes) return [ConnectorDataType.None];
  const parsedNodes = JSON.parse(nodes) as Node<WorkflowNodeData>[];
  const connections = new Set(parsedNodes.map((node) => node.data.dataType));
  return Array.from(connections).slice(0, 3);
};

const WorkflowCard = ({ workflow }: Props) => {
  const { id, name, description, published } = workflow;
  const connections = getConnections(workflow.nodes);

  return (
    <Card className="relative">
      <CardHeader className="w-full flex flex-col p-0">
        <div className="w-full h-24 flex items-center justify-center gap-2 bg-neutral-200 dark:bg-neutral-900">
          {connections.map((connection, index) => (
            <div className="flex items-center gap-2" key={index}>
              <WorkflowIconHelper type={connection} />
              {index !== connections.length - 1 && (
                <Minus className="text-neutral-400 dark:text-neutral-600" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <Link href={`/workflows/editor/${id}`}>
          <div className="mt-2.5 mb-7">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardContent>
      <div className="absolute left-0 bottom-3 px-4 w-full flex justify-between">
        <div className="flex items-center gap-2">
          <StatusDot available={published} />
          <p className="text-sm text-gray-500">
            {published ? "Published" : "Not published"}
          </p>
        </div>
        <WorkflowOptions workflow={workflow} />
      </div>
    </Card>
  );
};

export default WorkflowCard;
