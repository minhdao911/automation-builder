"use server";

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
