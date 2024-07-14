"use server";

import { SlackChannel } from "./slack-schemas";
import { CResponse } from "./types";

export const getChannels = async (
  token?: string
): Promise<CResponse<SlackChannel[]>> => {
  if (!token) return { error: "Error fetching Slack channels" };

  try {
    const response = await fetch("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const channels: SlackChannel[] = data.channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
    }));
    return {
      data: channels,
    };
  } catch (e) {
    console.error(e);
    return { error: "Error fetching Slack channels" };
  }
};

export const sendMessage = async (
  channelId: string,
  message: string,
  token?: string
) => {
  if (!token) return false;

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelId,
        text: message,
      }),
    });
    const data = await response.json();
    return data.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};
