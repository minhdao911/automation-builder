import { db } from "@/lib/db";
import { createCalendarEvent, sendEmail } from "@/lib/google-helpers";
import { DriveNotificationEventType } from "@/lib/google-schemas";
import { WorkflowNode } from "@/lib/types";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Drive notification received");

  const headerList = headers();
  const resourceId = headerList.get("x-goog-resource-id");
  const resourceState = headerList.get("x-goog-resource-state");

  console.log("Resource ID: ", resourceId);
  console.log("Resource State: ", resourceState);

  if (resourceId && resourceState) {
    const workflow = await db.workflow.findFirst({
      where: {
        driveResourceId: resourceId,
      },
    });

    if (!workflow) {
      console.log("Workflow not found");
      return NextResponse.json({ message: "Workflow not found" });
    }

    const nodes: WorkflowNode[] = workflow.nodes
      ? JSON.parse(workflow.nodes)
      : [];
    const flowPaths = workflow.flowPaths ? JSON.parse(workflow.flowPaths) : [];
    const triggerNode = nodes.find((n) => n.type === ConnectorNodeType.Trigger);

    if (!triggerNode) {
      console.log("Trigger node not found");
      return NextResponse.json({ message: "Trigger node not found" });
    }

    const subscribedEvents =
      triggerNode.data.metadata?.googleDrive?.events ?? [];
    if (
      !subscribedEvents.includes(resourceState as DriveNotificationEventType)
    ) {
      console.log("Event not subscribed");
      return NextResponse.json({ message: "Event not subscribed" });
    }

    for (const path of flowPaths) {
      for (let i = 1; i < path.length; i++) {
        const node = nodes.find((n) => n.id === path[i]);
        switch (node?.data.dataType) {
          case ConnectorDataType.Gmail:
            const emailData = node.data.metadata?.gmail;
            if (!emailData) break;
            console.log("Sending email");
            await sendEmail(emailData, workflow.userId);
            break;
          case ConnectorDataType.GoogleCalendar:
            const calendarData = node.data.metadata?.googleCalendar;
            if (!calendarData) break;
            console.log("Creating calendar event");
            await createCalendarEvent(calendarData, workflow.userId);
            break;
          default:
            break;
        }
      }
    }
  }

  return NextResponse.json({ message: "Success" });
}
