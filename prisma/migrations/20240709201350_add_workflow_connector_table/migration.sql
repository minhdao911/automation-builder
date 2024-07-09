-- CreateEnum
CREATE TYPE "WorkflowNodeType" AS ENUM ('Action', 'Trigger', 'Logical');

-- CreateEnum
CREATE TYPE "WorkflowDataType" AS ENUM ('GoogleDrive', 'Gmail', 'GoogleCalendar', 'Notion', 'Slack', 'Discord', 'Condition', 'TimeDelay', 'None');

-- CreateTable
CREATE TABLE "WorkflowConnector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodeType" "WorkflowNodeType" NOT NULL,
    "dataType" "WorkflowDataType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowConnector_pkey" PRIMARY KEY ("id")
);
