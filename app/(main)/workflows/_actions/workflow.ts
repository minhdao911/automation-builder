"use server";

import { db } from "@/lib/db";
import {
  CreateWorkFlowInputs,
  UpdateWorkFlowInputs,
  WorkflowConnectorEnriched,
} from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { ConnectorDataType, Workflow } from "@prisma/client";

export const createWorkflow = async (
  input: CreateWorkFlowInputs
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    try {
      await db.workflow.create({
        data: {
          ...input,
          userId,
        },
      });
      return { message: "Workflow created successfully" };
    } catch (e) {
      return { message: "Error creating workflow", error: true };
    }
  }
};

export const updateWorkflowDetails = async (
  input: UpdateWorkFlowInputs,
  workflowId: string
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    try {
      await db.workflow.update({
        where: {
          id: workflowId,
          userId,
        },
        data: {
          ...input,
        },
      });
      return { message: "Workflow details updated successfully" };
    } catch (e) {
      return { message: "Error updating workflow details", error: true };
    }
  }
};

export const deleteWorkflow = async (
  workflowId: string
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    try {
      await db.workflow.delete({
        where: {
          id: workflowId,
          userId,
        },
      });
      return { message: "Workflow deleted successfully" };
    } catch (e) {
      return { message: "Error deleting workflow", error: true };
    }
  }
};

export const getWorkflows = async (): Promise<Workflow[] | undefined> => {
  const { userId } = auth();

  if (userId) {
    return await db.workflow.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
};

export const getWorkflow = async (
  id: string
): Promise<Workflow | null | undefined> => {
  const { userId } = auth();

  if (userId) {
    return await db.workflow.findFirst({
      where: {
        userId,
        id,
      },
    });
  }
};

export const getWorkflowConnectors = async (): Promise<
  WorkflowConnectorEnriched[] | undefined
> => {
  const { userId } = auth();

  if (userId) {
    const connectorsMap: Record<ConnectorDataType, boolean> = {
      [ConnectorDataType.GoogleDrive]: false,
      [ConnectorDataType.Gmail]: false,
      [ConnectorDataType.GoogleCalendar]: false,
      [ConnectorDataType.Notion]: false,
      [ConnectorDataType.Slack]: false,
      [ConnectorDataType.Discord]: false,
      [ConnectorDataType.Condition]: false,
      [ConnectorDataType.TimeDelay]: false,
      [ConnectorDataType.None]: false,
    };

    const googleConnection = await db.googleCredential.findFirst({
      where: {
        userId,
      },
    });
    if (googleConnection) {
      connectorsMap[ConnectorDataType.GoogleDrive] = true;
      connectorsMap[ConnectorDataType.GoogleCalendar] = true;
      connectorsMap[ConnectorDataType.Gmail] = true;
    }

    const connectors = await db.workflowConnector.findMany();
    return connectors.map((connector) => ({
      ...connector,
      connected: connectorsMap[connector.dataType],
      createdAt: undefined,
      updatedAt: undefined,
    }));
  }
};
