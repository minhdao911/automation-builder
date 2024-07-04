import Category from "@/components/icons/category";
import Workflows from "@/components/icons/workflows";
import {
  Connection,
  ConnectionKey,
  ConnectionType,
  WorkflowNodeData,
  WorkflowNodeDataType,
  WorkflowNodeType,
} from "./types";

export const INTEGRATIONS = [
  "gmail",
  "google-drive",
  "google-calendar",
  "slack",
  "notion",
  "discord",
];

export const MENU_OPTIONS = [
  { name: "Workflows", Component: Workflows, href: "/workflows" },
  { name: "Connections", Component: Category, href: "/connections" },
];

export const CONNECTIONS: Connection[] = [
  {
    type: ConnectionType.GoogleDrive,
    description:
      "Connect your Google Drive account to listen to folder changes",
    icon: "google-drive",
    connectionKey: ConnectionKey.GoogleDriveNode,
    alwaysTrue: true,
  },
  {
    type: ConnectionType.Gmail,
    description: "Connect your Gmail account to send emails",
    icon: "gmail",
    connectionKey: ConnectionKey.GmailNode,
    alwaysTrue: true,
  },
  {
    type: ConnectionType.GoogleCalendar,
    description:
      "Connect your Google Calendar account to create and edit events",
    icon: "google-calendar",
    connectionKey: ConnectionKey.GmailNode,
    alwaysTrue: true,
  },
  {
    type: ConnectionType.Discord,
    description: "Connect your discord to send notification and messages",
    icon: "discord",
    connectionKey: ConnectionKey.DiscordNode,
    accessTokenKey: "webhookURL",
  },
  {
    type: ConnectionType.Notion,
    description: "Create entries in your notion dashboard and automate tasks.",
    icon: "notion",
    connectionKey: ConnectionKey.NotionNode,
    accessTokenKey: "accessToken",
  },
  {
    type: ConnectionType.Slack,
    description:
      "Use slack to send notifications to team members through your own custom bot.",
    icon: "slack",
    connectionKey: ConnectionKey.SlackNode,
    accessTokenKey: "slackAccessToken",
  },
];

export const EDITOR_DEFAULT_NODES: Record<
  WorkflowNodeType,
  WorkflowNodeData[]
> = {
  [WorkflowNodeType.Action]: [
    {
      id: "1",
      title: "Send email",
      // description: "Send email to a user with Gmail",
      type: WorkflowNodeDataType.Gmail,
      nodeType: WorkflowNodeType.Action,
    },
    {
      id: "2",
      title: "Send notification",
      // description: "Send a notification to Slack",
      type: WorkflowNodeDataType.Slack,
      nodeType: WorkflowNodeType.Action,
    },
  ],
  [WorkflowNodeType.Trigger]: [
    {
      id: "1",
      title: "When folder changes",
      // description: "Connect with Google drive to listen for folder changes",
      type: WorkflowNodeDataType.GoogleDrive,
      nodeType: WorkflowNodeType.Trigger,
    },
  ],
  [WorkflowNodeType.Logical]: [
    {
      id: "1",
      title: "Condition",
      // description: "Boolean operator that creates different conditions lanes.",
      type: WorkflowNodeDataType.Condition,
      nodeType: WorkflowNodeType.Logical,
    },
    {
      id: "2",
      title: "Time delay",
      // description: "Delay the next action step by using the wait timer.",
      type: WorkflowNodeDataType.TimeDelay,
      nodeType: WorkflowNodeType.Logical,
    },
  ],
};
