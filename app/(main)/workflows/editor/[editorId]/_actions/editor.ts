"use server";

import { db } from "@/lib/db";
import { WorkflowNode } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { groupBy } from "lodash";
import { Edge } from "reactflow";

export const loadWorkflow = async (workflowId: string) => {
  const emptyState = { nodes: [], edges: [] };
  try {
    const workflow = await db.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });
    if (workflow) {
      return {
        nodes: workflow.nodes ? JSON.parse(workflow.nodes) : [],
        edges: workflow.edges ? JSON.parse(workflow.edges) : [],
      };
    }
    return emptyState;
  } catch (e) {
    return emptyState;
  }
};

export const saveWorkflow = async (
  workflowId: string,
  data: {
    nodes: WorkflowNode[];
    edges: Edge[];
  }
) => {
  const { userId } = auth();
  if (!userId) return false;

  try {
    const flowPaths = generateFlowPaths(data.nodes, data.edges);
    const metadata = data.nodes.map((node) => node.data.metadata);
    const googleDriveMetadata = metadata.find(
      (m) => !!m?.googleDrive
    )?.googleDrive;

    let slackCredentialId: string | null = null;
    let slackUserId: string | null = null;
    if (hasSlackNode(data.nodes)) {
      const slackCredential = await getSlackCredential(userId);
      if (slackCredential) {
        slackCredentialId = slackCredential.id;
        slackUserId = slackCredential.slackUserId;
      }
    }

    const workflow = await db.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });
    if (workflow) {
      await db.workflow.update({
        where: {
          id: workflowId,
        },
        data: {
          nodes: JSON.stringify(data.nodes),
          edges: JSON.stringify(data.edges),
          flowPaths: JSON.stringify(flowPaths),
          driveResourceId: googleDriveMetadata?.resourceId,
          slackCredentialId,
          slackUserId,
        },
      });
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const generateFlowPaths = (
  nodes: WorkflowNode[],
  edges: Edge[]
): string[][] => {
  const triggerNodeId = nodes.find(
    (node) => node.type === ConnectorNodeType.Trigger
  )?.id;

  const sources = groupBy(edges, "source");
  const flowPaths: string[] = [];

  function traverse(nodeId: string, path: string) {
    const node = sources[nodeId];
    path += nodeId;

    if (!node) {
      flowPaths.push(path);
      return;
    }

    path += "->";
    if (node[0]?.target) {
      traverse(node[0].target, path);
    }
    if (node[1]?.target) {
      traverse(node[1].target, path);
    }
  }

  if (triggerNodeId) {
    traverse(triggerNodeId, "");
  }

  return flowPaths.map((path) => path.split("->"));
};

const hasSlackNode = (nodes: WorkflowNode[]) => {
  return nodes.some((node) => node.data.dataType === ConnectorDataType.Slack);
};

const getSlackCredential = async (userId: string) => {
  try {
    return await db.slackCredential.findFirst({
      where: {
        userId,
      },
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};
