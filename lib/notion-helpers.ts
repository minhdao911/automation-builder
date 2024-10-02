"use server";

import {
  NotionDatabaseProperty,
  NotionMetadata,
  NotionParent,
  NotionParentType,
} from "@/model/notion-schemas";
import { Client } from "@notionhq/client";

export const searchPagesAndDatabases = async (
  type: NotionParentType,
  connectionKey?: string
): Promise<NotionParent[]> => {
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
      const result = response.results
        .filter((result) =>
          type === NotionParentType.Page
            ? (result as any).properties.title
            : true
        )
        .map((result) => ({
          id: result.id,
          title: getTitle(type, result) ?? "Untitled",
        }));
      return result;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getTitle = (type: NotionParentType, result: any): string | undefined => {
  if (type === NotionParentType.Page) {
    return result.properties.title.title[0]?.plain_text;
  }
  return result.title?.[0]?.plain_text;
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
