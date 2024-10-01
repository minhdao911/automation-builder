"use server";

import { db } from "@/lib/db";
import {
  CreateWorkFlowInputs,
  UpdateWorkFlowInputs,
  WorkflowConnectorEnriched,
  WorkflowConnectorSchema,
} from "@/model/types";
import { auth } from "@clerk/nextjs/server";
import { ConnectorDataType, Workflow } from "@prisma/client";
import { getConnection } from "../../connections/_actions/connection";

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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
    try {
      const connectorsMap: Record<
        ConnectorDataType,
        {
          connected: boolean;
          connectionKey?: string;
        }
      > = {
        [ConnectorDataType.GoogleDrive]: { connected: false },
        [ConnectorDataType.Gmail]: { connected: false },
        [ConnectorDataType.GoogleCalendar]: { connected: false },
        [ConnectorDataType.Notion]: { connected: false },
        [ConnectorDataType.Slack]: { connected: false },
        [ConnectorDataType.Discord]: { connected: false },
        [ConnectorDataType.Condition]: { connected: false },
        [ConnectorDataType.TimeDelay]: { connected: false },
        [ConnectorDataType.None]: { connected: false },
      };

      const connection = await getConnection();
      if (connection?.googleCredentialId) {
        connectorsMap[ConnectorDataType.GoogleDrive].connected = true;
        connectorsMap[ConnectorDataType.GoogleCalendar].connected = true;
        connectorsMap[ConnectorDataType.Gmail].connected = true;
      }
      if (connection?.slackCredentialId) {
        connectorsMap[ConnectorDataType.Slack].connected = true;
        const slackCredential = await db.slackCredential.findFirst({
          where: {
            id: connection.slackCredentialId,
          },
        });
        connectorsMap[ConnectorDataType.Slack].connectionKey =
          slackCredential?.accessToken;
      }
      if (connection?.notionCredentialId) {
        connectorsMap[ConnectorDataType.Notion].connected = true;
        const notionCredential = await db.notionCredential.findFirst({
          where: {
            id: connection.notionCredentialId,
          },
        });
        connectorsMap[ConnectorDataType.Notion].connectionKey =
          notionCredential?.accessToken;
      }

      const connectors = await db.workflowConnector.findMany();
      return connectors.map((connector) => {
        const parsedConnector = WorkflowConnectorSchema.parse(connector);
        return {
          ...parsedConnector,
          connected: connectorsMap[parsedConnector.dataType].connected,
          connectionKey: connectorsMap[parsedConnector.dataType].connectionKey,
        };
      });
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
};
