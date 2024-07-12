import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export const getOauth2Client = async (userId: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );

  const clerkResponse = (
    await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google")
  ).data as any;
  const accessToken = clerkResponse[0].token;
  oauth2Client.setCredentials({ access_token: accessToken });

  return oauth2Client;
};
