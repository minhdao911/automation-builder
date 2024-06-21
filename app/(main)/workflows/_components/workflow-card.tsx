import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import StatusDot from "@/components/ui/status-dot";
import { Workflow } from "@prisma/client";
import { Node } from "reactflow";
import { WorkflowNodeData, WorkflowNodeDataType } from "@/lib/types";
import WorkflowIconHelper from "@/components/workflow-icon-helper";

type Props = {
  workflow: Workflow;
};

const getConnections = (nodes: string | null) => {
  if (!nodes) return [WorkflowNodeDataType.None];
  const parsedNodes = JSON.parse(nodes) as Node<WorkflowNodeData>[];
  const connections = new Set(parsedNodes.map((node) => node.data.type));
  return Array.from(connections).slice(0, 3);
};

const WorkflowCard = ({ workflow }: Props) => {
  const { id, name, description, published } = workflow;
  const connections = getConnections(workflow.nodes);

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex items-center gap-3">
            {connections.map((connection, index) => (
              <WorkflowIconHelper key={index} type={connection} />
            ))}
          </div>
          <div className="my-2.5">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot available={published} />
            <p className="text-sm text-gray-500">
              {published ? "Published" : "Not published"}
            </p>
          </div>
        </Link>
      </CardHeader>
    </Card>
  );
};

export default WorkflowCard;
