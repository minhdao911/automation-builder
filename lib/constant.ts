import Category from "@/components/icons/category";
import Workflows from "@/components/icons/workflows";
import { Connection } from "./types";

export const integrations = [
  "gmail",
  "google-drive",
  "google-calendar",
  "slack",
  "notion",
  "discord",
];

export const menuOptions = [
  { name: "Workflows", Component: Workflows, href: "/workflows" },
  { name: "Connections", Component: Category, href: "/connections" },
];

export const CONNECTIONS: Connection[] = [
  {
    type: "Google Drive",
    description:
      "Connect your Google Drive account to listen to folder changes",
    icon: "google-drive",
    connectionKey: "googleNode",
    alwaysTrue: true,
  },
];
