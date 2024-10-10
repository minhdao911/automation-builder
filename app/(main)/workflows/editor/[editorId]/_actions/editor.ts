"use server";

import { db } from "@/lib/db";
import { WorkflowNode, WorkflowVariables } from "@/model/types";
import { auth } from "@clerk/nextjs/server";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { groupBy } from "lodash";
import { Edge } from "reactflow";

export const publishWorkflow = async (
  workflowId: string,
  state: boolean = true
) => {
  const { userId } = auth();
  if (!userId) return false;

  try {
    await db.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        published: state,
      },
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const saveWorkflow = async (
  workflowId: string,
  data: {
    nodes: WorkflowNode[];
    edges: Edge[];
    variables: WorkflowVariables;
    triggerNodeId?: string;
  }
) => {
  const { userId } = auth();
  if (!userId) return false;

  try {
    const flowPaths = generateFlowPaths(data.edges, data.triggerNodeId);
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
      await saveWorkflowVariables(workflowId, data.variables);
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const generateFlowPaths = (
  edges: Edge[],
  triggerNodeId?: string
): string[][] => {
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

export const getWorkflowVariables = async (workflowId: string) => {
  return await db.workflowVariables.findUnique({
    where: {
      workflowId,
    },
  });
};

const saveWorkflowVariables = async (
  workflowId: string,
  variables: WorkflowVariables
) => {
  const savedVars = await getWorkflowVariables(workflowId);
  if (savedVars) {
    return await db.workflowVariables.update({
      where: {
        id: savedVars.id,
      },
      data: {
        data: JSON.stringify(variables),
      },
    });
  }
  return await db.workflowVariables.create({
    data: {
      workflowId,
      data: JSON.stringify(variables),
    },
  });
};
