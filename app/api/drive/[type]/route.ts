import {
  DriveDataType,
  DriveGetParams,
  DriveResponseSchema,
} from "@/lib/google-schemas";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: DriveGetParams) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkResponse = (
    await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google")
  ).data as any;
  const accessToken = clerkResponse[0].token;
  oauth2Client.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    if (params.type === DriveDataType.Folder) {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return NextResponse.json(data.files);
    } else if (params.type === DriveDataType.File) {
      const response = await drive.files.list({
        q: "mimeType!='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return NextResponse.json(data.files);
    } else {
      return NextResponse.json(
        { error: "Invalid requested type" },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ status: 500 });
  }
}
