import { z } from "zod";

export enum NotionParentType {
  Page = "page_id",
  Database = "database_id",
}
export enum NotionDatabasePropertyType {
  RichText = "rich_text",
  Number = "number",
  Date = "date",
  People = "people",
  Files = "files",
  Checkbox = "checkbox",
  URL = "url",
  Email = "email",
  PhoneNumber = "phone_number",
  CreatedTime = "created_time",
  CreatedBy = "created_by",
  LastEditedTime = "last_edited_time",
  LastEditedBy = "last_edited_by",
  // Title = "title",
  // Select = "select",
  // MultiSelect = "multi_select",
  // Status = "status",
  // Relation = "relation",
  // Rollup = "rollup",
  // Formula = "formula",
}
export enum NotionTitlePropertyType {
  Title = "title",
}
export const EnrichedNotionDatabaseProperties = {
  ...NotionDatabasePropertyType,
  ...NotionTitlePropertyType,
};

const ParentSchema = z.object({
  type: z.nativeEnum(NotionParentType),
  database_id: z.string().optional(),
  page_id: z.string().optional(),
  workspace: z.literal(true).optional(),
});
const CoverSchema = z.object({
  type: z.literal("external"),
  external: z.object({
    url: z.string(),
  }),
});
const IconSchema = z.object({
  type: z.literal("emoji"),
  emoji: z.string(),
});
const RichTextSchema = z.object({
  type: z.literal("text"),
  text: z.object({
    content: z.string(),
  }),
});
const BlockSchema = z.object({
  object: z.literal("block"),
  paragraph: z.object({
    rich_text: z.array(RichTextSchema),
  }),
});
const DatabasePropertySchema = z.object({
  name: z.string(),
  type: z.nativeEnum(EnrichedNotionDatabaseProperties),
});
export type NotionDatabaseProperty = z.infer<typeof DatabasePropertySchema>;

const NotionPageSchema = z.object({
  parent: ParentSchema,
  cover: CoverSchema.optional(),
  icon: IconSchema.optional(),
  properties: z.object({
    title: z.string(),
  }),
  children: z.array(BlockSchema),
});
export type NotionPage = z.infer<typeof NotionPageSchema>;

const NotionDatabaseSchema = z.object({
  parent: ParentSchema,
  cover: CoverSchema.optional(),
  icon: IconSchema.optional(),
  title: z.array(RichTextSchema),
  properties: z.record(z.string(), DatabasePropertySchema),
});
export type NotionDatabase = z.infer<typeof NotionDatabaseSchema>;

const NotionSearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  parent: ParentSchema,
});
export type NotionSearchResult = z.infer<typeof NotionSearchResultSchema>;

export const NotionMetadataSchema = z.object({
  parentId: z.string(),
  parentType: z.nativeEnum(NotionParentType),
  parentName: z.string().optional(),
  title: z.string(),
  icon: z.string().optional(),
  content: z.string().optional(),
  properties: z.array(DatabasePropertySchema).optional(),
  pageId: z.string().optional(),
});
export type NotionMetadata = z.infer<typeof NotionMetadataSchema>;
