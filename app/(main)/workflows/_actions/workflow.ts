"use server";

import { db } from "@/lib/db";
import {
  CreateWorkFlowInputs,
  UpdateWorkFlowInputs,
  Usage,
  Workflow,
  WorkflowConnectorEnriched,
  WorkflowConnectorSchema,
} from "@/model/types";
import { auth } from "@clerk/nextjs/server";
import {
  ConnectorDataType,
  ConnectorNodeType,
  Workflow as DbWorkflow,
} from "@prisma/client";
import { getConnection } from "../../connections/_actions/connection";
import { getWorkflowVariables } from "../editor/[editorId]/_actions/editor";

export const createWorkflow = async (
  input: CreateWorkFlowInputs
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    const usage = await getUsageLimit();
    const workflows = await db.workflow.findMany({
      where: {
        userId,
      },
    });

    if (!usage.unlimited && workflows.length >= usage.workflowLimit) {
      return {
        message: "You have reached the maximum number of workflows",
        error: true,
      };
    }

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

export const getWorkflows = async (): Promise<DbWorkflow[] | undefined> => {
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
): Promise<DbWorkflow | null | undefined> => {
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

export const loadWorkflow = async (id: string) => {
  const { userId } = auth();

  if (userId) {
    const result: Workflow = {
      id: "",
      name: "",
      published: false,
      nodes: [],
      edges: [],
      triggerNode: null,
      variables: {},
      usage: {
        workflowLimit: 0,
        nodeLimit: 0,
        unlimited: false,
      },
    };
    try {
      const workflow = await db.workflow.findFirst({
        where: {
          userId,
          id,
        },
      });

      if (workflow) {
        result.id = workflow.id;
        result.name = workflow.name;
        result.published = workflow.published;
        result.nodes = workflow.nodes ? JSON.parse(workflow.nodes) : [];
        result.edges = workflow.edges ? JSON.parse(workflow.edges) : [];
        result.triggerNode =
          result.nodes.find(
            (node) => node.data.nodeType === ConnectorNodeType.Trigger
          ) ?? null;

        const variables = await getWorkflowVariables(workflow.id);
        if (variables?.data) {
          result.variables = JSON.parse(variables.data);
        }

        const usage = await getUsageLimit();
        result.usage = usage;

        return result;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
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

export const checkAdmin = async () => {
  const { sessionClaims } = auth();
  return sessionClaims?.metadata.role === "admin";
};

export const getUsageLimit = async (): Promise<Usage> => {
  const { userId, sessionClaims } = auth();

  if (userId) {
    const role = sessionClaims?.metadata.role ?? "user";
    const usage = await db.usageSettings.findUnique({
      where: {
        role,
      },
    });
    if (usage) {
      return {
        workflowLimit: usage.workflowLimit ?? 0,
        nodeLimit: usage.nodeLimit ?? 0,
        unlimited: usage.unlimited,
      };
    }
  }
  return {
    workflowLimit: 0,
    nodeLimit: 0,
    unlimited: false,
  };
};
