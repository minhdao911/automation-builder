"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getOauth2Client } from "./google-auth";
import { google } from "googleapis";
import { db } from "./db";

export const sendEmail = async (
  email: {
    to: string;
    subject: string;
    html: string;
  },
  auth?: { userId: string }
) => {
  let userId = auth?.userId;
  let fromAddress: string = "";
  if (!userId) {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    userId = user.id;
    fromAddress = user.emailAddresses[0].emailAddress;
  } else {
    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    fromAddress = user.email;
  }

  const { to, subject, html } = email;

  try {
    const oauth2Client = await getOauth2Client(userId);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const emailMessage =
      `From: ${fromAddress}\n` +
      `To: ${to}\n` +
      `Subject: ${subject}\n\n` +
      html;

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: btoa(emailMessage),
      },
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
