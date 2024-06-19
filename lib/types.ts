import { z } from "zod";

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