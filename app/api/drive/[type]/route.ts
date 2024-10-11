import { getOauth2ClientWithToken } from "@/lib/google-auth";
import { handleError } from "@/lib/google-helpers";
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
    const oauth2Client = await getOauth2ClientWithToken(userId);
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
    const { message } = await handleError(
      e,
      userId,
      "Error fetching drive data"
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
