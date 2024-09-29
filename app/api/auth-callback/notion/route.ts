import { ConnectionType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const redirectUrl = `${process.env.APP_URL}/connections`;

  if (error) {
    return NextResponse.redirect(
      `${redirectUrl}?dataType=${ConnectionType.Notion}&error=${error}`
    );
  }

  if (!code) {
    return NextResponse.json({ message: "Missing code" }, { status: 400 });
  }

  try {
    const encoded = Buffer.from(
      `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
    ).toString("base64");
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NOTION_REDIRECT_URI!,
      }),
    });

    if (response.status !== 200) {
      return NextResponse.json({ error: response.statusText }, { status: 500 });
    }

    const data = await response.json();
    const urlParams = new URLSearchParams({
      dataType: ConnectionType.Notion,
      accessToken: data.access_token,
      workspaceId: data.workspace_id,
      workspaceName: data.workspace_name,
      botId: data.bot_id,
    });
    return NextResponse.redirect(`${redirectUrl}?${urlParams.toString()}`);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error authenticating Notion" },
      { status: 500 }
    );
  }
}
