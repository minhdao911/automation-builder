import { db } from "@/lib/db";
import { runWorkflows } from "@/lib/workflows";
import { Workflow } from "@prisma/client";
import { createHmac } from "crypto";
import dayjs from "dayjs";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { challenge } = body;

  // Respond to Slack challenge
  if (challenge) {
    return Response.json({ challenge });
  }

  // Verify the Slack request
  const headerPayload = headers();
  const slackSigningSecret = headerPayload.get("x-slack-signature");
  const timestamp = headerPayload.get("x-slack-request-timestamp");

  if (dayjs().add(5, "minute").isBefore(dayjs(timestamp))) {
    console.error("Request expired");
    return Response.json({ error: "Request expired" }, { status: 400 });
  }

  const signatureBaseString = `v0:${timestamp}:${JSON.stringify(body)}`;
  const hmac = createHmac("sha256", process.env.SLACK_SIGNING_SECRET!);
  const signature = `v0=${hmac.update(signatureBaseString).digest("hex")}`;

  if (signature !== slackSigningSecret) {
    console.error("Invalid signature");
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the Slack event
  const { team_id, event, event_time, authorizations } = body;
  console.log("Slack event received", body);

  const currentTime = dayjs().unix();
  const eventLag = currentTime - event_time;
  console.log("Event lag:", eventLag);
  if (eventLag > 2) {
    console.log("Duplicate event");
    return Response.json({ message: "Duplicate event" });
  }

  if (team_id) {
    const slackCredentials = await db.slackCredential.findMany({
      where: {
        teamId: team_id,
      },
    });
    const allWorkflows: Workflow[] = [];
    for (const credential of slackCredentials) {
      const workflows = await db.workflow.findMany({
        where: {
          slackCredentialId: credential.id,
          nodes: {
            contains: `"channelId":"${event.channel}"`,
          },
        },
      });
      allWorkflows.push(...workflows);
    }
    if (allWorkflows.length === 0) {
      console.log(`No workflows found for team id ${team_id}`);
      return Response.json({
        message: `No workflows found for team id ${team_id}`,
      });
    }

    try {
      await runWorkflows(allWorkflows, { event, authorizations });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        return Response.json({ message: e.message });
      }
      console.error(e);
      return Response.json(
        { message: "Error running workflow" },
        { status: 500 }
      );
    }
  }

  return Response.json({ message: "success" });
}
