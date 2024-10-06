import {
  ConnectorDataType,
  ConnectorEvenType,
  ConnectorNodeType,
  Workflow,
} from "@prisma/client";
import {
  LogicalComparisionOperator,
  LogicalConnectionOperator,
  Rule,
  TimeUnit,
  VariableType,
  WorkflowNode,
} from "../model/types";
import { createCalendarEvent, sendEmail } from "./google-helpers";
import { sendMessage } from "./slack-helpers";
import { DriveNotificationEventType } from "../model/google-schemas";
import { createDatabase, createPage, deletePage } from "./notion-helpers";

type LoggerType = "log" | "error" | "info" | "warn";
type Logger = (message: string, type?: LoggerType) => void;

export const runWorkflows = async (workflows: Workflow[], data?: any) => {
  for (const workflow of workflows) {
    const log: Logger = (message: string, type: LoggerType = "log") => {
      console[type](message, {
        userId: workflow.userId,
        workflowId: workflow.id,
      });
    };

    try {
      if (!workflow.published) {
        log("Workflow not published");
        continue;
      }

      const nodes: WorkflowNode[] = workflow.nodes
        ? JSON.parse(workflow.nodes)
        : [];
      const flowPaths = workflow.flowPaths
        ? JSON.parse(workflow.flowPaths)
        : [];
      const triggerNode = nodes.find(
        (n) => n.type === ConnectorNodeType.Trigger
      );

      if (!triggerNode) {
        log("Trigger node not found", "error");
        continue;
      }

      if (!validateEvent(workflow, triggerNode, data)) {
        log("Event not subscribed", "error");
        continue;
      }

      for (const path of flowPaths) {
        process_workflow: for (let i = 1; i < path.length; i++) {
          const node = nodes.find((n) => n.id === path[i]);
          switch (node?.type) {
            case ConnectorNodeType.Action: {
              await processEvent(workflow, log, node, data);
              break;
            }
            case ConnectorNodeType.Logical: {
              const result = await processLogical(triggerNode, node, data);
              if (!result) {
                log("Logical condition not met", "error");
                break process_workflow;
              }
              break;
            }
            default:
              break;
          }
        }
      }
    } catch (e) {
      log(JSON.stringify(e), "error");
    }
  }
};

const processEvent = async (
  workflow: Workflow,
  log: Logger,
  node?: WorkflowNode,
  data?: any
) => {
  switch (node?.data.eventType) {
    // Google
    case ConnectorEvenType.Gmail_SendEmail: {
      const emailData = node.data.metadata?.gmail;
      if (!emailData) break;
      log("Sending email");
      await sendEmail(emailData, workflow.userId);
      break;
    }
    case ConnectorEvenType.GoogleCalendar_CreateEvent: {
      const calendarData = node.data.metadata?.googleCalendar;
      if (!calendarData) break;
      log("Creating calendar event");
      await createCalendarEvent(calendarData, workflow.userId);
      break;
    }
    // Slack
    case ConnectorEvenType.Slack_SendMessage: {
      const slackData = node.data.metadata?.slack;
      if (!slackData) break;
      log("Sending slack message");
      const channelId =
        data.event.channel_type === "channel"
          ? slackData.channelId
          : data.event.channel;
      await sendMessage(channelId, slackData.text!, node.data.connectionKey);
      break;
    }
    // Notion
    case ConnectorEvenType.Notion_CreatePage: {
      const notionData = node.data.metadata?.notion;
      if (!notionData) break;
      log("Creating notion page");
      await createPage(notionData, node.data.connectionKey);
      break;
    }
    case ConnectorEvenType.Notion_CreateDatabase: {
      const notionDatabaseData = node.data.metadata?.notion;
      if (!notionDatabaseData) break;
      log("Creating notion database");
      await createDatabase(notionDatabaseData, node.data.connectionKey);
      break;
    }
    case ConnectorEvenType.Notion_DeletePageFromDatabase: {
      const notionData = node.data.metadata?.notion;
      if (!notionData) break;
      log("Deleting notion page");
      await deletePage(notionData.pageId, node.data.connectionKey);
      break;
    }
    default:
      break;
  }
};

const processLogical = async (
  triggerNode: WorkflowNode,
  node?: WorkflowNode,
  data?: any
) => {
  // Logical
  switch (node?.data.dataType) {
    case ConnectorDataType.Condition: {
      const conditionData = node.data.metadata?.condition;
      if (!conditionData) break;

      switch (triggerNode.data.eventType) {
        case ConnectorEvenType.GoogleDrive_FileChanged: {
          const rules: boolean[] = [];
          conditionData.rules.forEach((rule) => {
            switch (rule.variable) {
              case VariableType.GoogleDrive_Event: {
                const variable = data.resourceState;
                rules.push(applyRule(rule, variable));
                break;
              }
              default:
                break;
            }
          });
          return applyCondition(rules, conditionData.connector);
        }
        case ConnectorEvenType.Slack_MessageReceived: {
          const rules: boolean[] = [];
          conditionData.rules.forEach((rule) => {
            switch (rule.variable) {
              case VariableType.Slack_IncomingMessage: {
                const variable = data.event.text;
                rules.push(applyRule(rule, variable));
                break;
              }
              case VariableType.Slack_SenderId: {
                const variable = data.event.user;
                rules.push(applyRule(rule, variable));
                break;
              }
              default:
                break;
            }
          });
          return applyCondition(rules, conditionData.connector);
        }
        default:
          return false;
      }
    }
    case ConnectorDataType.TimeDelay: {
      const timeDelayData = node.data.metadata?.timeDelay;
      if (!timeDelayData) break;

      const delay = timeDelayData.value;
      const unit = timeDelayData.unit;

      await new Promise((resolve) => {
        setTimeout(resolve, delay * getDelayMultiplier(unit));
      });
      return true;
    }
    default:
      return true;
  }
};

const applyRule = (rule: Rule, variable: any) => {
  switch (rule.operator) {
    case LogicalComparisionOperator.Equal: {
      return variable.toLowerCase() === rule.input;
    }
    case LogicalComparisionOperator.NotEqual: {
      return variable.toLowerCase() !== rule.input;
    }
    case LogicalComparisionOperator.Contains: {
      return variable.toLowerCase().includes(rule.input);
    }
    default:
      return false;
  }
};

const applyCondition = (
  rules: boolean[],
  connector?: LogicalConnectionOperator
) => {
  if (connector === LogicalConnectionOperator.And) {
    if (rules.some((rule) => !rule)) return false;
  } else if (connector === LogicalConnectionOperator.Or) {
    if (rules.every((rule) => !rule)) return false;
  }
  return rules[0];
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

const getDelayMultiplier = (unit: TimeUnit): number => {
  switch (unit) {
    case TimeUnit.Second:
      return 1000;
    case TimeUnit.Minute:
      return 1000 * 60;
    case TimeUnit.Hour:
      return 1000 * 60 * 60;
    case TimeUnit.Day:
      return 1000 * 60 * 60 * 24;
    default:
      throw new Error("Invalid time unit");
  }
};
