"use server";

import { google } from "googleapis";
import { db } from "./db";
import { GOOGLE_SCOPES } from "./constants";

const getOauth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL}/api/auth-callback/google`
  );
};

export const getOauth2ClientWithToken = async (userId: string) => {
  const oauth2Client = getOauth2Client();
  const googleCredential = await db.googleCredential.findUnique({
    where: {
      userId,
    },
  });
  if (!googleCredential) {
    throw new Error("No google credential found");
  }
  oauth2Client.setCredentials({ refresh_token: googleCredential.refreshToken });
  return oauth2Client;
};

export const getAuthUrl = async () => {
  try {
    const oauth2Client = await getOauth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: "offline", // Ensures a refresh token is returned
      scope: GOOGLE_SCOPES,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getTokenInfo = async (accessToken: string) => {
  const oauth2Client = getOauth2Client();
  return await oauth2Client.getTokenInfo(accessToken);
};

export const getRefreshToken = async (code: string) => {
  const oauth2Client = getOauth2Client();
  return (await oauth2Client.getToken(code)).tokens.refresh_token;
};
