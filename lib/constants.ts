import Category from "@/components/icons/category";
import Workflows from "@/components/icons/workflows";
import { ConnectionData, ConnectionType } from "./types";

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

export const CONNECTIONS: ConnectionData[] = [
  {
    type: ConnectionType.GoogleDrive,
    description:
      "Connect your Google Drive account to listen to folder changes",
    icon: "google-drive",
  },
  {
    type: ConnectionType.Gmail,
    description: "Connect your Gmail account to send emails",
    icon: "gmail",
  },
  {
    type: ConnectionType.GoogleCalendar,
    description:
      "Connect your Google Calendar account to create and edit events",
    icon: "google-calendar",
  },
  {
    type: ConnectionType.Discord,
    description: "Connect your discord to send notification and messages",
    icon: "discord",
  },
  {
    type: ConnectionType.Notion,
    description: "Create entries in your notion dashboard and automate tasks.",
    icon: "notion",
  },
  {
    type: ConnectionType.Slack,
    description:
      "Use slack to send notifications to team members through your own custom bot.",
    icon: "slack",
  },
];
