import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { z } from "zod";
import { DriveMetadataSchema, EmailSchema } from "./google-schemas";

export enum ConnectionType {
  GoogleDrive = "Google Drive",
  Gmail = "Gmail",
  GoogleCalendar = "Google Calendar",
  Notion = "Notion",
  Slack = "Slack",
  Discord = "Discord",
}

export enum ConnectionKey {
  GoogleDriveNode = "googleDriveNode",
  GmailNode = "gmailNode",
  GoogleCalendarNode = "googleCalendarNode",
  NotionNode = "notionNode",
  SlackNode = "slackNode",
  DiscordNode = "discordNode",
}

export type Connection = {
  type: ConnectionType;
  description: string;
  icon: string;
  connectionKey: ConnectionKey;
  accessTokenKey?: string;
  alwaysTrue?: boolean;
};

const CreateWorkflowInputsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});
export type CreateWorkFlowInputs = z.infer<typeof CreateWorkflowInputsSchema>;
export type UpdateWorkFlowInputs = CreateWorkFlowInputs;

const PostitionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const WorkflowNodeMetadataSchema = z.object({
  googleDrive: DriveMetadataSchema.optional(),
  gmail: EmailSchema.optional(),
});
export type WorkflowNodeMetadata = z.infer<typeof WorkflowNodeMetadataSchema>;

export const WorkflowConnectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  nodeType: z.nativeEnum(ConnectorNodeType),
  dataType: z.nativeEnum(ConnectorDataType),
});
export type WorkflowConnector = z.infer<typeof WorkflowConnectorSchema>;

export const WorkflowConnectorEnrichedSchema = WorkflowConnectorSchema.extend({
  connected: z.boolean(),
});
export type WorkflowConnectorEnriched = z.infer<
  typeof WorkflowConnectorEnrichedSchema
>;

export const WorkflowNodeDataSchema = WorkflowConnectorEnrichedSchema.extend({
  selected: z.boolean().optional(),
  metadata: WorkflowNodeMetadataSchema.optional(),
});
export type WorkflowNodeData = z.infer<typeof WorkflowNodeDataSchema>;

export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: PostitionSchema,
  data: WorkflowNodeDataSchema,
  width: z.number().optional(),
  height: z.number().optional(),
  positionAbsolute: PostitionSchema.optional(),
});
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
