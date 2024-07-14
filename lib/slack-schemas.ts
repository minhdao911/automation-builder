import { z } from "zod";

export const SlackMessageSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
  text: z.string(),
});
export type SlackMessage = z.infer<typeof SlackMessageSchema>;

export const SlackChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type SlackChannel = z.infer<typeof SlackChannelSchema>;
