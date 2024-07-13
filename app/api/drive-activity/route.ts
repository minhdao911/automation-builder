import { getOauth2Client } from "@/lib/google-auth";
import { auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { expiration, fileId } = body;
  if (!fileId) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  try {
    const oauth2Client = await getOauth2Client(userId);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const channelId = uuidv4();
    const listener = await drive.files.watch({
      fileId,
      requestBody: {
        id: channelId,
        type: "web_hook",
        address: `${process.env.SERVER_URL}/api/drive-activity/notification`,
        kind: "api#channel",
        expiration,
      },
    });
    if (listener.status === 200) {
      console.log(listener.data);
      return NextResponse.json(listener.data);
    }
    return NextResponse.json(
      { error: "Error creating listener" },
      { status: 500 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error creating listener" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { channelId, resourceId } = body;
  if (!channelId || !resourceId) {
    return NextResponse.json(
      { error: "Missing channel ID or resource ID" },
      { status: 400 }
    );
  }
  try {
    const oauth2Client = await getOauth2Client(userId);
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const response = await drive.channels.stop({
      requestBody: {
        id: channelId,
        resourceId,
      },
    });
    if (response.status === 204) {
      return NextResponse.json({ message: "Listener stopped" });
    }
    return NextResponse.json(
      { error: "Error stopping listener" },
      { status: 500 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error stopping listener" },
      { status: 500 }
    );
  }
}
