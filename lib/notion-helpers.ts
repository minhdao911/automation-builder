"use server";

import { NotionMetadata, NotionParent } from "@/model/notion-schemas";
import { Client } from "@notionhq/client";

type SearchType = "page" | "database";

export const searchPagesAndDatabases = async (
  type: SearchType,
  connectionKey?: string
): Promise<NotionParent[]> => {
  if (!connectionKey) return [];
  try {
    const notion = new Client({
      auth: connectionKey,
    });
    const response = await notion.search({
      filter: {
        value: type,
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
          type === "page" ? (result as any).properties.title : true
        )
        .map((result) => ({
          id: result.id,
          title: getTitle(type, result) ?? "Untitled",
        }));
      console.log(result);
      return result;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getTitle = (type: SearchType, result: any): string | undefined => {
  if (type === "page") {
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
      icon: {
        type: "emoji",
        emoji: data.icon as any,
      },
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
