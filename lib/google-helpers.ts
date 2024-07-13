"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getOauth2Client } from "./google-auth";
import { google } from "googleapis";
import { db } from "./db";
import { CalendarEvent, Email } from "./google-schemas";

export const authorize = async (userId?: string) => {
  if (userId) {
    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.clerkId,
      email: user.email,
    };
  } else {
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
    };
  }
};

export const sendEmail = async (email: Email, userId?: string) => {
  const { to, subject, html } = email;
  try {
    const user = await authorize(userId);
    const oauth2Client = await getOauth2Client(user.id);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const emailMessage =
      `From: ${user.email}\n` +
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

export const createCalendarEvent = async (
  event: CalendarEvent,
  userId?: string
) => {
  try {
    const user = await authorize(userId);
    const oauth2Client = await getOauth2Client(user.id);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
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
