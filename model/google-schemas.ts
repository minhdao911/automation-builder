import { z } from "zod";

export enum DriveDataType {
  File = "file",
  Folder = "folder",
}

export enum DriveNotificationEventType {
  Sync = "sync",
  Update = "update",
  Remove = "remove",
  Add = "add",
  Trash = "trash",
  Untrash = "untrash",
}

const DriveDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
});
export type DriveData = z.infer<typeof DriveDataSchema>;

const DriveGetParamsSchema = z.object({
  params: z.object({
    type: z.nativeEnum(DriveDataType),
  }),
});
export type DriveGetParams = z.infer<typeof DriveGetParamsSchema>;

export const DriveResponseSchema = z.object({
  files: z.array(DriveDataSchema),
});
export type DriveResponse = z.infer<typeof DriveResponseSchema>;

export const DriveMetadataSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(DriveDataType),
  channelId: z.string(),
  resourceId: z.string().nullish(),
  expiration: z.number(),
  events: z.array(z.nativeEnum(DriveNotificationEventType)).min(1),
});

export const EmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
});
export type Email = z.infer<typeof EmailSchema>;

export const CalendarEventSchema = z.object({
  summary: z.string(),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string(),
  }),
  end: z.object({
    dateTime: z.string(),
  }),
});
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const CalendarMetadataSchema = CalendarEventSchema.pick({
  summary: true,
  description: true,
}).extend({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});
export type CalendarMetadata = z.infer<typeof CalendarMetadataSchema>;
