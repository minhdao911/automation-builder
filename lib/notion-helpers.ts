"use server";

import {
  NotionDatabaseProperty,
  NotionMetadata,
  NotionSearchResult,
  NotionParentType,
} from "@/model/notion-schemas";
import { Client } from "@notionhq/client";

export const searchPagesAndDatabases = async (
  type: NotionParentType,
  connectionKey?: string
): Promise<NotionSearchResult[]> => {
  if (!connectionKey) return [];
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.search({
      filter: {
        value: type === NotionParentType.Page ? "page" : "database",
        property: "object",
      },
      sort: {
        direction: "ascending",
        timestamp: "last_edited_time",
      },
    });
    if (response.results) {
      const results = await Promise.all(
        response.results.map(async (result) => ({
          id: result.id,
          title: (await getTitle(type, result)) ?? "Untitled",
          icon: getIcon(result),
          parent: (result as any).parent,
        }))
      );
      return results;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const searchPagesWithParentDatabase = async (
  connectionKey?: string
): Promise<NotionSearchResult[]> => {
  if (!connectionKey) return [];
  try {
    const response = await searchPagesAndDatabases(
      NotionParentType.Page,
      connectionKey
    );
    if (response.length > 0) {
      const results = response.filter((result) => !!result.parent.database_id);
      return results;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const retrievePage = async (id?: string, connectionKey?: string) => {
  if (!connectionKey || !id) return;
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.pages.retrieve({ page_id: id });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const retrieveDatabase = async (id?: string, connectionKey?: string) => {
  if (!connectionKey || !id) return;
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.databases.retrieve({ database_id: id });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const createPage = async (
  data: NotionMetadata,
  connectionKey?: string
) => {
  if (!connectionKey) return;
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.pages.create({
      parent:
        data.parentType === "page_id"
          ? { type: "page_id", page_id: data.parentId }
          : { type: "database_id", database_id: data.parentId },
      icon: data.icon
        ? {
            type: "emoji",
            emoji: data.icon as any,
          }
        : undefined,
      properties: {
        title: [
          {
            text: {
              content: data.title,
            },
          },
        ],
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: data.content ?? "",
                },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const createDatabase = async (
  data: NotionMetadata,
  connectionKey?: string
) => {
  if (!connectionKey) return;
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: data.parentId,
      },
      icon: data.icon
        ? {
            type: "emoji",
            emoji: data.icon as any,
          }
        : undefined,
      title: [
        {
          type: "text",
          text: {
            content: data.title,
          },
        },
      ],
      properties: transformProperties(data.properties!),
    });
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const deletePage = async (id?: string, connectionKey?: string) => {
  if (!connectionKey || !id) return;
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    await notion.pages.update({
      page_id: id,
      archived: true,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getTitle = async (
  type: NotionParentType,
  result: any
): Promise<string | undefined> => {
  if (type === NotionParentType.Page) {
    return (
      result.properties.title?.title[0]?.plain_text ||
      result.properties["Name"]?.title[0]?.plain_text
    );
  }
  return result.title?.[0]?.plain_text;
};

const getIcon = (result: any) => result.icon?.emoji ?? "";

const transformProperties = (properties: NotionDatabaseProperty[]) =>
  properties.reduce(
    (acc, { name, type }) => ({
      ...acc,
      [name]: {
        [type]: {},
      },
    }),
    {}
  );
