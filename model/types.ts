import {
  ConnectorDataType,
  ConnectorEvenType,
  ConnectorNodeType,
} from "@prisma/client";
import { z } from "zod";
import {
  CalendarMetadataSchema,
  DriveMetadataSchema,
  EmailSchema,
} from "./google-schemas";
import { SlackMessageSchema } from "./slack-schemas";
import { NotionMetadataSchema } from "./notion-schemas";
import { Edge, Node } from "reactflow";

export enum ConnectionType {
  GoogleDrive = "GoogleDrive",
  Gmail = "Gmail",
  GoogleCalendar = "GoogleCalendar",
  Notion = "Notion",
  Slack = "Slack",
  Discord = "Discord",
}

export enum VariableType {
  GoogleDrive_Event = "GoogleDrive:Event",
  Slack_IncomingMessage = "Slack:Incoming message",
  Slack_SenderId = "Slack:Sender ID",
}

export enum LogicalComparisionOperator {
  Equal = "Equals",
  NotEqual = "Does not equal",
  Contains = "Contains",
  NotContains = "Does not contain",
  MatchPattern = "Matches pattern",
}

export enum LogicalConnectionOperator {
  And = "And",
  Or = "Or",
}

export enum TimeUnit {
  Second = "Second",
  Minute = "Minute",
  Hour = "Hour",
  Day = "Day",
}

export type ConnectionData = {
  type: ConnectionType;
  description: string;
};

const UsageSchema = z.object({
  workflowLimit: z.number(),
  nodeLimit: z.number(),
  unlimited: z.boolean(),
});
export type Usage = z.infer<typeof UsageSchema>;

const RuleSchema = z.object({
  id: z.string(),
  variable: z.nativeEnum(VariableType).optional(),
  operator: z.nativeEnum(LogicalComparisionOperator),
  input: z.string(),
});
export type Rule = z.infer<typeof RuleSchema>;

const ConditionSchema = z.object({
  connector: z.nativeEnum(LogicalConnectionOperator).optional(),
  rules: z.array(RuleSchema),
});
export type Condition = z.infer<typeof ConditionSchema>;

const TimeDelaySchema = z.object({
  value: z.number(),
  unit: z.nativeEnum(TimeUnit),
});
export type TimeDelay = z.infer<typeof TimeDelaySchema>;

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
  googleCalendar: CalendarMetadataSchema.optional(),
  slack: SlackMessageSchema.optional(),
  notion: NotionMetadataSchema.optional(),
  condition: ConditionSchema.optional(),
  timeDelay: TimeDelaySchema.optional(),
});
export type WorkflowNodeMetadata = z.infer<typeof WorkflowNodeMetadataSchema>;

export const WorkflowConnectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  nodeType: z.nativeEnum(ConnectorNodeType),
  dataType: z.nativeEnum(ConnectorDataType),
  eventType: z.nativeEnum(ConnectorEvenType).nullish(),
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

const WorkflowVariableSchema = z.object({
  name: z.string(),
  value: z.string(),
  nodeId: z.string().optional(),
  ruleId: z.string().optional(),
  removed: z.boolean().optional(),
});
export type WorkflowVariable = z.infer<typeof WorkflowVariableSchema>;

const WorkflowVariablesSchema = z.record(WorkflowVariableSchema);
export type WorkflowVariables = z.infer<typeof WorkflowVariablesSchema>;

export type Workflow = {
  id: string;
  name: string;
  published: boolean;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  variables: WorkflowVariables;
  triggerNode: Node<WorkflowNodeData> | null;
  usage: Usage;
};

export type CResponse<T = undefined> = {
  data?: T;
  error?: boolean;
  message?: string;
};
