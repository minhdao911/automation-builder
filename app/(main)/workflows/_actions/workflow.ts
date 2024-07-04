"use server";

import { db } from "@/lib/db";
import { CreateWorkFlowInputs, UpdateWorkFlowInputs } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";

export const createWorkflow = async (
  input: CreateWorkFlowInputs
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    try {
      await db.workflow.create({
        data: {
          ...input,
          userId,
        },
      });
      return { message: "Workflow created successfully" };
    } catch (e) {
      return { message: "Error creating workflow", error: true };
    }
  }
};

export const updateWorkflowDetails = async (
  input: UpdateWorkFlowInputs,
  workflowId: string
): Promise<{ message: string; error?: boolean } | undefined> => {
  const { userId } = auth();

  if (userId) {
    try {
      await db.workflow.update({
        where: {
          id: workflowId,
          userId,
        },
        data: {
          ...input,
        },
      });
      return { message: "Workflow details updated successfully" };
    } catch (e) {
      return { message: "Error updating workflow details", error: true };
    }
  }
};

export const getWorkflows = async (): Promise<Workflow[] | undefined> => {
  const { userId } = auth();

  if (userId) {
    return await db.workflow.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
};

export const getWorkflow = async (
  id: string
): Promise<Workflow | null | undefined> => {
  const { userId } = auth();

  if (userId) {
    return await db.workflow.findFirst({
      where: {
        userId,
        id,
      },
    });
  }
};
