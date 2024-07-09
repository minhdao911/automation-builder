import { z } from "zod";

export enum DriveDataType {
  File = "file",
  Folder = "folder",
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
