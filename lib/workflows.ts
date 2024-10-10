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
  WorkflowVariable,
  WorkflowVariables,
} from "../model/types";
import { createCalendarEvent, sendEmail } from "./google-helpers";
import { sendMessage } from "./slack-helpers";
import {
  CalendarMetadata,
  DriveNotificationEventType,
} from "../model/google-schemas";
import { createDatabase, createPage, deletePage } from "./notion-helpers";
import { getWorkflowVariables } from "@/app/(main)/workflows/editor/[editorId]/_actions/editor";
import { SlackMessage } from "@/model/slack-schemas";
import { NotionMetadata } from "@/model/notion-schemas";

type LoggerType = "log" | "error" | "info" | "warn";
type Logger = (message: string, type?: LoggerType) => void;
type ApplyResult = { pass: boolean; variables?: WorkflowVariable[] };

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

      let wfVars: WorkflowVariables | null = null;
      const wfVarsEntity = await getWorkflowVariables(workflow.id);
      if (wfVarsEntity) {
        wfVars = JSON.parse(wfVarsEntity.data);
      }

      for (const path of flowPaths) {
        process_workflow: for (let i = 1; i < path.length; i++) {
          const node = nodes.find((n) => n.id === path[i]);
          switch (node?.type) {
            case ConnectorNodeType.Action: {
              await processEvent(workflow, wfVars, log, node, data);
              break;
            }
            case ConnectorNodeType.Logical: {
              const result = await processLogical(triggerNode, node, data);
              if (!result.pass) {
                log("Logical condition not met", "error");
                break process_workflow;
              }
              if (result.variables) {
                if (!wfVars) break;
                for (const key in wfVars) {
                  const variable = wfVars[key];
                  const value = result.variables.find(
                    (v) =>
                      v.nodeId === variable.nodeId &&
                      v.ruleId === variable.ruleId &&
                      v.name === variable.value
                  )?.value;
                  if (value) {
                    wfVars[key].value = value;
                  }
                }
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
  variables: WorkflowVariables | null,
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
      let processedData = calendarData;
      if (variables) {
        processedData = processMetadataValues(
          calendarData,
          variables!
        ) as CalendarMetadata;
      }
      log("Creating calendar event");
      await createCalendarEvent(processedData, workflow.userId);
      break;
    }
    // Slack
    case ConnectorEvenType.Slack_SendMessage: {
      const slackData = node.data.metadata?.slack;
      if (!slackData) break;
      let processedData = slackData;
      if (variables) {
        processedData = processMetadataValues(
          slackData,
          variables!
        ) as SlackMessage;
      }
      const channelId =
        data.event.channel_type === "channel"
          ? slackData.channelId
          : data.event.channel;
      log("Sending slack message");
      await sendMessage(
        channelId,
        processedData.text!,
        node.data.connectionKey
      );
      break;
    }
    // Notion
    case ConnectorEvenType.Notion_CreatePage: {
      const notionData = node.data.metadata?.notion;
      if (!notionData) break;
      let processedData = notionData;
      if (variables) {
        processedData = processMetadataValues(
          notionData,
          variables!
        ) as NotionMetadata;
      }
      log("Creating notion page");
      await createPage(processedData, node.data.connectionKey);
      break;
    }
    case ConnectorEvenType.Notion_CreateDatabase: {
      const notionDatabaseData = node.data.metadata?.notion;
      if (!notionDatabaseData) break;
      let processedData = notionDatabaseData;
      if (variables) {
        processedData = processMetadataValues(
          notionDatabaseData,
          variables!
        ) as NotionMetadata;
      }
      log("Creating notion database");
      await createDatabase(processedData, node.data.connectionKey);
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

const processMetadataValues = (
  data: Record<string, any>,
  variables: WorkflowVariables
) => {
  for (const key in data) {
    if (typeof data[key] === "string") {
      data[key] = replacePlaceholders(data[key], variables);
    }
  }
  return data;
};

const processLogical = async (
  triggerNode: WorkflowNode,
  node?: WorkflowNode,
  data?: any
): Promise<ApplyResult> => {
  switch (node?.data.dataType) {
    case ConnectorDataType.Condition: {
      const conditionData = node.data.metadata?.condition;
      if (!conditionData) return { pass: false };

      switch (triggerNode.data.eventType) {
        case ConnectorEvenType.GoogleDrive_FileChanged: {
          const rules: ApplyResult[] = [];
          conditionData.rules.forEach((rule) => {
            switch (rule.variable) {
              case VariableType.GoogleDrive_Event: {
                const variable = data.resourceState;
                rules.push(applyRule(rule, variable, node.id));
                break;
              }
              default:
                break;
            }
          });
          return applyCondition(rules, conditionData.connector);
        }
        case ConnectorEvenType.Slack_MessageReceived: {
          const rules: ApplyResult[] = [];
          conditionData.rules.forEach((rule) => {
            switch (rule.variable) {
              case VariableType.Slack_IncomingMessage: {
                const variable = data.event.text;
                rules.push(applyRule(rule, variable, node.id));
                break;
              }
              case VariableType.Slack_SenderId: {
                const variable = data.event.user;
                rules.push(applyRule(rule, variable, node.id));
                break;
              }
              default:
                break;
            }
          });
          return applyCondition(rules, conditionData.connector);
        }
        default:
          return { pass: false };
      }
    }
    case ConnectorDataType.TimeDelay: {
      const timeDelayData = node.data.metadata?.timeDelay;
      if (!timeDelayData) return { pass: false };

      const delay = timeDelayData.value;
      const unit = timeDelayData.unit;

      await new Promise((resolve) => {
        setTimeout(resolve, delay * getDelayMultiplier(unit));
      });
      return { pass: true };
    }
    default:
      return { pass: true };
  }
};

const applyRule = (rule: Rule, variable: any, nodeId: string): ApplyResult => {
  switch (rule.operator) {
    case LogicalComparisionOperator.Equal: {
      return { pass: variable.toLowerCase() === rule.input };
    }
    case LogicalComparisionOperator.NotEqual: {
      return { pass: variable.toLowerCase() !== rule.input };
    }
    case LogicalComparisionOperator.Contains: {
      return { pass: variable.toLowerCase().includes(rule.input) };
    }
    case LogicalComparisionOperator.NotContains: {
      return { pass: !variable.toLowerCase().includes(rule.input) };
    }
    case LogicalComparisionOperator.MatchPattern: {
      try {
        const extractedValues = extractValuesFromPattern(rule.input, variable);
        return {
          pass: true,
          variables: extractedValues.map((v) => ({
            ...v,
            ruleId: rule.id,
            nodeId,
          })),
        };
      } catch (e) {
        console.error(e);
        return { pass: false };
      }
    }
    default:
      return { pass: false };
  }
};

const applyCondition = (
  rules: ApplyResult[],
  connector?: LogicalConnectionOperator
): ApplyResult => {
  if (connector === LogicalConnectionOperator.And) {
    if (rules.some((rule) => !rule.pass)) return { pass: false };
  } else if (connector === LogicalConnectionOperator.Or) {
    if (rules.every((rule) => !rule.pass)) return { pass: false };
  }
  return { pass: true, variables: rules.flatMap((r) => r.variables ?? []) };
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

const extractValuesFromPattern = (
  pattern: string,
  input: string
): { name: string; value: string }[] => {
  // Create a regular expression to match all placeholders {{...}}
  const regexPlaceholder = /{{(.*)}}/g;

  // Collect the keys (e.g., 'date', 'start', 'end') by finding all placeholders in the pattern
  const keys = [];
  let match;
  let regexPattern = pattern;

  // Replace each placeholder with a regex group and store the key
  while ((match = regexPlaceholder.exec(pattern)) !== null) {
    keys.push(match[1]); // Store the key like 'date', 'start', etc.
    regexPattern = regexPattern.replace(match[0], "(.*)"); // Replace {{key}} with a regex group
  }

  // Create the regex from the transformed pattern
  const regex = new RegExp(regexPattern);

  // Execute the regex on the input string
  const matches = input.match(regex);

  if (matches) {
    const extractedValues: WorkflowVariable[] = [];
    keys.forEach((key, index) => {
      extractedValues.push({
        name: `{{${key}}}`,
        value: matches[index + 1], // The first match is the full string, so offset by 1
      });
    });
    return extractedValues;
  } else {
    throw new Error("Input does not match the pattern");
  }
};

const replacePlaceholders = (pattern: string, variables: WorkflowVariables) => {
  return pattern.replace(/{{(.*)}}/g, (match, key) => {
    return variables[key.trim()].value || match;
  });
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
