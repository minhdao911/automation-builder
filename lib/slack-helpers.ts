"use server";

import { SlackChannel, SlackChannelType } from "../model/slack-schemas";
import { CResponse } from "../model/types";

export const getChannels = async (
  token?: string
): Promise<CResponse<SlackChannel[]>> => {
  if (!token) return { message: "Error fetching Slack channels", error: true };

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
      type: SlackChannelType.Channel,
    }));
    return {
      data: [
        ...channels,
        {
          id: "im",
          name: "Direct message",
          type: SlackChannelType.Im,
        },
      ],
    };
  } catch (e) {
    console.error(e);
    return { message: "Error fetching Slack channels", error: true };
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
