"use server";

import { createConnection } from "@/lib/connections";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Connection } from "@prisma/client";

export const getConnection = async (): Promise<Connection | null> => {
  const { userId } = auth();
  if (userId) {
    try {
      const connection = await db.connection.findFirst({
        where: {
          userId,
        },
      });
      return connection;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  return null;
};

export const createNotionConnection = async (data: {
  accessToken: string;
  botId: string;
  workspaceId: string;
  workspaceName: string;
}): Promise<{ message: string; error?: boolean }> => {
  const { userId } = auth();
  if (userId) {
    try {
      const notionCredential = await db.notionCredential.create({
        data: {
          userId,
          ...data,
        },
      });
      await createConnection(userId, { notion: notionCredential });
      return { message: "Notion connection created successfully" };
    } catch (e) {
      console.error(e);
      return { message: "Error creating Notion connection", error: true };
    }
  }
  return { message: "Unauthorized", error: true };
};
