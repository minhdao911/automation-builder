"use server";

import { db } from "@/lib/db";

export const loadWorkflowData = async (workflowId: string) => {
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
    nodes: string;
    edges: string;
  }
) => {
  try {
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
        data,
      });
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
