import { z } from "zod";

export enum SlackChannelType {
  Channel = "channel",
  Im = "im",
}

export const SlackMessageSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
  text: z.string().optional(),
  channelType: z.nativeEnum(SlackChannelType),
});
export type SlackMessage = z.infer<typeof SlackMessageSchema>;

export const SlackChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(SlackChannelType),
});
export type SlackChannel = z.infer<typeof SlackChannelSchema>;
