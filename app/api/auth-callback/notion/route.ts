import { ConnectionType } from "@/model/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const redirectUrl = `${process.env.APP_URL}/connections`;
  const errorRedirectUrl = `${redirectUrl}?dataType=${ConnectionType.Notion}&error=Failed to authenticate with Notion`;

  if (error) {
    console.error("Error authenticating Notion", error);
    return NextResponse.redirect(errorRedirectUrl);
  }

  if (!code) {
    console.error("Error authenticating Notion: Missing code");
    return NextResponse.redirect(errorRedirectUrl);
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
        redirect_uri: `${process.env.APP_URL}/api/auth-callback/notion`,
      }),
    });

    if (response.status !== 200) {
      console.error("Error authenticating Notion", response.statusText);
      return NextResponse.redirect(errorRedirectUrl);
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
    console.error("Error authenticating Notion", e);
    return NextResponse.redirect(errorRedirectUrl);
  }
}
