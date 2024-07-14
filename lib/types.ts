import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { z } from "zod";
import {
  CalendarEventSchema,
  DriveMetadataSchema,
  EmailSchema,
} from "./google-schemas";
import { SlackMessageSchema } from "./slack-schemas";

export enum ConnectionType {
  GoogleDrive = "GoogleDrive",
  Gmail = "Gmail",
  GoogleCalendar = "GoogleCalendar",
  Notion = "Notion",
  Slack = "Slack",
  Discord = "Discord",
}

export type ConnectionData = {
  type: ConnectionType;
  description: string;
  icon: string;
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
  googleCalendar: CalendarEventSchema.optional(),
  slack: SlackMessageSchema.optional(),
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
  connectionKey: z.string().optional(),
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

export type CResponse<T> = {
  data?: T;
  error?: string;
};
