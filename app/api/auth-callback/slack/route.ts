import { createConnection } from "@/lib/connections";
import { db } from "@/lib/db";
import { ConnectionType } from "@/model/types";
import { parseJwt } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const redirectUrl =
    `${process.env.APP_URL}${state}` || `${process.env.APP_URL}/connections`;
  const errorRedirectUrl = `${redirectUrl}?dataType=${ConnectionType.Slack}&error=Failed to authenticate with Slack`;

  if (error) {
    console.error("Error authenticating Slack", error);
    return NextResponse.redirect(errorRedirectUrl);
  }

  if (!code) {
    console.error("Error authenticating Slack: Missing code");
    return NextResponse.redirect(errorRedirectUrl);
  }

  try {
    const response = await fetch("https://slack.com/api/openid.connect.token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.APP_URL}/api/auth-callback/slack`,
      }).toString(),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Error authenticating Slack", data.error);
      return NextResponse.redirect(errorRedirectUrl);
    }

    const userData = parseJwt(data.id_token);
    const slackCredential = await db.slackCredential.create({
      data: {
        accessToken: data.access_token,
        idToken: data.id_token,
        slackUserId: userData[`${userData.iss}/user_id`],
        teamId: userData[`${userData.iss}/team_id`],
        teamName: userData[`${userData.iss}/team_name`],
        userId: userData.nonce,
      },
    });
    await createConnection(userData.nonce, { slack: slackCredential });

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error("Error authenticating Slack", e);
    return NextResponse.redirect(errorRedirectUrl);
  }
}
