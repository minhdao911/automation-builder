import { getOauth2Client } from "@/lib/google-auth";
import {
  DriveDataType,
  DriveGetParams,
  DriveResponseSchema,
} from "@/model/google-schemas";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: DriveGetParams) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oauth2Client = await getOauth2Client(userId);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    if (params.type === DriveDataType.Folder) {
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return NextResponse.json({ data: data.files });
    } else if (params.type === DriveDataType.File) {
      const response = await drive.files.list({
        q: "mimeType!='application/vnd.google-apps.folder'",
        fields: "files(id, name, mimeType)",
      });
      const data = DriveResponseSchema.parse(response.data);
      return NextResponse.json({ data: data.files });
    }
    return NextResponse.json(
      { error: "Invalid requested type" },
      { status: 400 }
    );
  } catch (e: any) {
    console.error(e);
    if (e.errors?.[0].code === "oauth_missing_refresh_token") {
      return NextResponse.json(
        {
          error: "Missing refresh token, please sign out and sign in again",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
