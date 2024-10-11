"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { getOauth2ClientWithToken } from "./google-auth";
import { google } from "googleapis";
import { db } from "./db";
import {
  CalendarMetadata,
  DriveData,
  DriveDataType,
  DriveResponseSchema,
  Email,
} from "../model/google-schemas";
import { CResponse } from "../model/types";
import dayjs from "dayjs";

export const authorize = async (userId?: string) => {
  try {
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
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getDriveFiles = async (
  type: DriveDataType
): Promise<CResponse<DriveData[]>> => {
  const { userId } = auth();
  if (!userId) return { message: "Unauthorized", error: true };

  try {
    const oauth2Client = await getOauth2ClientWithToken(userId);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    if (type === DriveDataType.Folder) {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return { data: data.files };
    } else if (type === DriveDataType.File) {
      const response = await drive.files.list({
        q: "mimeType!='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return { data: data.files };
    }
    return { message: "Invalid requested type", error: true };
  } catch (e: any) {
    return handleError(e, userId, "Error fetching drive data");
  }
};

export const sendEmail = async (
  email: Email,
  userId?: string
): Promise<CResponse> => {
  const { to, subject, html } = email;

  const errorMessage = "Error sending email";
  const successMessage = "Email sent successfully";

  const user = await authorize(userId);
  if (!user) return { message: errorMessage, error: true };

  try {
    const oauth2Client = await getOauth2ClientWithToken(user.id);
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
      return { message: successMessage };
    }
    return { message: errorMessage, error: true };
  } catch (e: any) {
    return handleError(e, user.id, errorMessage);
  }
};

export const createCalendarEvent = async (
  data: CalendarMetadata,
  userId?: string
): Promise<CResponse> => {
  const errorMessage = "Error creating calendar event";
  const successMessage = "Calendar event created successfully";

  const user = await authorize(userId);
  if (!user) return { message: errorMessage, error: true };

  try {
    const oauth2Client = await getOauth2ClientWithToken(user.id);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: {
          dateTime: dayjs(data.date)
            .set("hour", parseInt(data.startTime.split(":")[0]))
            .set("minute", parseInt(data.startTime.split(":")[1]))
            .format(),
        },
        end: {
          dateTime: dayjs(data.date)
            .set("hour", parseInt(data.endTime.split(":")[0]))
            .set("minute", parseInt(data.endTime.split(":")[1]))
            .format(),
        },
      },
    });
    if (response.status === 200) {
      return { message: successMessage };
    }
    return { message: errorMessage, error: true };
  } catch (e) {
    return handleError(e, user.id, errorMessage);
  }
};

export const handleError = async <T>(
  e: any,
  userId: string,
  errorMessage: string
): Promise<CResponse<T>> => {
  console.error(e);
  if (e.response.data.error === "invalid_grant") {
    await db.googleCredential.delete({
      where: {
        userId,
      },
    });
    return {
      message: "Token is expired, please connect again in connections page",
      error: true,
    };
  }
  return { message: errorMessage, error: true };
};
