import { NotionCredential, SlackCredential } from "@prisma/client";
import { db } from "./db";
import { ConnectionType, WorkflowNode } from "../model/types";

export const createConnection = async (
  userId: string,
  data: {
    slack?: SlackCredential;
    notion?: NotionCredential;
  } = {}
) => {
  await db.connection.update({
    where: {
      userId,
    },
    data: {
      slackCredentialId: data.slack?.id,
      notionCredentialId: data.notion?.id,
    },
  });
  const workflows = await db.workflow.findMany({
    where: {
      userId,
    },
  });
  Promise.all(
    workflows.map(async (workflow) => {
      const nodes = workflow.nodes ? JSON.parse(workflow.nodes) : [];
      nodes.forEach((node: WorkflowNode, index: number) => {
        if (node.data.dataType === ConnectionType.Slack) {
          nodes[index].data.connected = true;
          nodes[index].data.connectionKey = data.slack?.accessToken;
        }
      });
      return await db.workflow.update({
        where: {
          id: workflow.id,
        },
        data: {
          nodes: JSON.stringify(nodes),
          slackCredentialId: data.slack?.id,
          slackUserId: data.slack?.slackUserId,
          notionCredentialId: data.notion?.id,
        },
      });
    })
  );
};
