import { getOauth2Client } from "@/lib/google-auth";
import {
  DriveDataType,
  DriveGetParams,
  DriveResponseSchema,
} from "@/lib/google-schemas";
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
