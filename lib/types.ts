export type ConnectionType = "Google Drive" | "Notion" | "Slack" | "Discord";

export type ConnectionKey =
  | "googleNode"
  | "notionNode"
  | "slackNode"
  | "discordNode";

export type Connection = {
  type: ConnectionType;
  description: string;
  icon: string;
  connectionKey: ConnectionKey;
  accessTokenKey?: string;
  alwaysTrue?: boolean;
};
