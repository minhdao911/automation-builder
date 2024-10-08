import Category from "@/components/icons/category";
import Workflows from "@/components/icons/workflows";
import { ConnectionData, ConnectionType, VariableType } from "../model/types";
import { ConnectorDataType } from "@prisma/client";

export const INTEGRATIONS = [
  {
    name: "Google Drive",
    type: ConnectorDataType.GoogleDrive,
  },
  {
    name: "Gmail",
    type: ConnectorDataType.Gmail,
  },
  {
    name: "Google Calendar",
    type: ConnectorDataType.GoogleCalendar,
  },
  {
    name: "Notion",
    type: ConnectorDataType.Notion,
  },
  {
    name: "Slack",
    type: ConnectorDataType.Slack,
  },
  // {
  //   name: "Discord",
  //   type: ConnectorDataType.Discord,
  // },
];

export const VARIABLE_TYPES = {
  [ConnectorDataType.GoogleDrive]: [VariableType.GoogleDrive_Event],
  [ConnectorDataType.Slack]: [
    VariableType.Slack_IncomingMessage,
    VariableType.Slack_SenderId,
  ],
  [ConnectorDataType.GoogleCalendar]: [],
  [ConnectorDataType.Gmail]: [],
  [ConnectorDataType.Notion]: [],
  [ConnectorDataType.Discord]: [],
  [ConnectorDataType.TimeDelay]: [],
  [ConnectorDataType.Condition]: [],
  [ConnectorDataType.None]: [],
};

export const MENU_OPTIONS = [
  { name: "Workflows", Component: Workflows, href: "/workflows" },
  { name: "Connections", Component: Category, href: "/connections" },
];

export const CONNECTIONS: ConnectionData[] = [
  {
    type: ConnectionType.GoogleDrive,
    description:
      "Connect your Google Drive account to listen to folder changes",
  },
  {
    type: ConnectionType.Gmail,
    description: "Connect your Gmail account to send emails",
  },
  {
    type: ConnectionType.GoogleCalendar,
    description:
      "Connect your Google Calendar account to create and edit events",
  },
  // {
  //   type: ConnectionType.Discord,
  //   description: "Connect your discord to send notification and messages",
  // },
  {
    type: ConnectionType.Notion,
    description: "Create entries in your notion dashboard and automate tasks.",
  },
  {
    type: ConnectionType.Slack,
    description:
      "Use slack to send notifications to team members through your own custom bot.",
  },
];
