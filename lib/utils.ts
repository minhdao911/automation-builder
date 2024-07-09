import { ConnectorDataType } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    method: arg?.method ?? "GET",
    body: arg?.data ? JSON.stringify(arg.data) : undefined,
  }).then((res) => res.json());

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
