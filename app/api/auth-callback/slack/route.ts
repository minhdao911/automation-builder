import { createConnection } from "@/lib/connections";
import { db } from "@/lib/db";
import { ConnectionType } from "@/model/types";
import { parseJwt } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const APP_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.APP_URL;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const redirectUrl =
    `https://${APP_URL}${state}` || `https://${APP_URL}/connections`;

  if (error) {
    return NextResponse.redirect(
      `${redirectUrl}?dataType=${ConnectionType.Slack}&error=${error}`
    );
  }

  if (!code) {
    return NextResponse.json({ message: "Missing code" }, { status: 400 });
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
        redirect_uri: `https://${APP_URL}/api/auth-callback/slack`,
      }).toString(),
    });

    const data = await response.json();
    if (!data.ok) {
      return NextResponse.json({ error: data.error }, { status: 500 });
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
    console.error(e);
    return NextResponse.json(
      { error: "Error authenticating Slack" },
      { status: 500 }
    );
  }
}
