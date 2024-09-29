import {
  ConnectorDataType,
  ConnectorEvenType,
  ConnectorNodeType,
  Workflow,
} from "@prisma/client";
import { WorkflowNode } from "../model/types";
import { createCalendarEvent, sendEmail } from "./google-helpers";
import { sendMessage } from "./slack-helpers";
import { DriveNotificationEventType } from "../model/google-schemas";

export const runWorkflows = async (workflows: Workflow[], data?: any) => {
  for (const workflow of workflows) {
    const log = (
      message: string,
      type: "log" | "error" | "info" | "warn" = "log"
    ) => {
      console[type](message, {
        userId: workflow.userId,
        workflowId: workflow.id,
      });
    };

    if (!workflow.published) {
      log("Workflow not published");
      continue;
    }

    const nodes: WorkflowNode[] = workflow.nodes
      ? JSON.parse(workflow.nodes)
      : [];
    const flowPaths = workflow.flowPaths ? JSON.parse(workflow.flowPaths) : [];
    const triggerNode = nodes.find((n) => n.type === ConnectorNodeType.Trigger);

    if (!triggerNode) {
      log("Trigger node not found", "error");
      continue;
    }

    if (!validateEvent(workflow, triggerNode, data)) {
      log("Event not subscribed", "error");
      continue;
    }

    for (const path of flowPaths) {
      for (let i = 1; i < path.length; i++) {
        const node = nodes.find((n) => n.id === path[i]);
        switch (node?.data.eventType) {
          case ConnectorEvenType.Gmail_SendEmail:
            const emailData = node.data.metadata?.gmail;
            if (!emailData) break;
            log("Sending email");
            await sendEmail(emailData, workflow.userId);
            break;
          case ConnectorEvenType.GoogleCalendar_CreateEvent:
            const calendarData = node.data.metadata?.googleCalendar;
            if (!calendarData) break;
            log("Creating calendar event");
            await createCalendarEvent(calendarData, workflow.userId);
            break;
          case ConnectorEvenType.Slack_SendMessage:
            const slackData = node.data.metadata?.slack;
            if (!slackData) break;
            log("Sending slack message");
            const channelId =
              data.event.channel_type === "channel"
                ? slackData.channelId
                : data.event.channel;
            await sendMessage(
              channelId,
              slackData.text!,
              node.data.connectionKey
            );
            break;
          default:
            break;
        }
      }
    }
  }
};

const validateEvent = (
  workflow: Workflow,
  triggerNode: WorkflowNode,
  data?: any
): boolean => {
  switch (triggerNode.data.dataType) {
    case ConnectorDataType.GoogleDrive: {
      const subscribedEvents =
        triggerNode.data.metadata?.googleDrive?.events ?? [];
      if (
        !subscribedEvents.includes(
          data.resourceState as DriveNotificationEventType
        )
      ) {
        return false;
      }
      break;
    }
    case ConnectorDataType.Slack: {
      const slackData = triggerNode.data.metadata?.slack;
      if (slackData?.channelType !== data.event.channel_type) {
        return false;
      }
      if (
        data.event.channel_type === "channel" &&
        slackData?.channelId !== data.event.channel
      ) {
        return false;
      }
      if (
        data.event.channel_type === "channel" &&
        workflow.slackUserId === data.event.user
      ) {
        return false;
      }
      if (
        data.event.channel_type === "im" &&
        workflow.slackUserId !== data.authorizations?.[0]?.user_id
      ) {
        return false;
      }
      if (
        data.event.channel_type === "im" &&
        workflow.slackUserId === data.event.user
      ) {
        return false;
      }
      break;
    }
    default:
      break;
  }
  return true;
};