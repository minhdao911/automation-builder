import { Connection, ConnectorDataType } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConnectionType } from "../model/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export const fetcherMutation = async (
  url: string,
  { arg }: { arg: any | undefined }
) =>
  fetch(url, {
    headers: arg?.headers ?? undefined,
    method: arg?.method ?? "GET",
    body: arg?.data ? JSON.stringify(arg.data) : undefined,
  }).then((res) => res.json());

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return Buffer.from(token, "base64").toString();
  }
};

export const mapConnectorDataType = (type: ConnectorDataType) => {
  switch (type) {
    case ConnectorDataType.GoogleDrive:
      return "Google Drive";
    case ConnectorDataType.GoogleCalendar:
      return "Google Calendar";
    case ConnectorDataType.TimeDelay:
      return "Time Delay";
    default:
      return type;
  }
};

export const mapConnectionType = (connection: Connection) => {
  const connections: { [key in ConnectionType]: boolean } = {
    GoogleDrive: false,
    Gmail: false,
    GoogleCalendar: false,
    Notion: false,
    Slack: false,
    Discord: false,
  };
  if (connection.googleCredentialId) {
    connections[ConnectorDataType.GoogleDrive] = true;
    connections[ConnectorDataType.GoogleCalendar] = true;
    connections[ConnectorDataType.Gmail] = true;
  }
  if (connection.slackCredentialId) {
    connections[ConnectorDataType.Slack] = true;
  }
  if (connection.notionCredentialId) {
    connections[ConnectorDataType.Notion] = true;
  }
  return connections;
};

export const doesContainVariable = (value: any) => {
  return RegExp(/.*{{.*}}.*/g).test(value);
};

export const splitValueByVariables = (value: string) => {
  const regex = /({{.*?}})/;
  return value.split(regex).filter(Boolean);
};
