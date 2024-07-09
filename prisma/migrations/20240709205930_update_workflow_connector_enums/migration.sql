/*
  Warnings:

  - Changed the type of `nodeType` on the `WorkflowConnector` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dataType` on the `WorkflowConnector` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConnectorNodeType" AS ENUM ('Action', 'Trigger', 'Logical');

-- CreateEnum
CREATE TYPE "ConnectorDataType" AS ENUM ('GoogleDrive', 'Gmail', 'GoogleCalendar', 'Notion', 'Slack', 'Discord', 'Condition', 'TimeDelay', 'None');

-- AlterTable
ALTER TABLE "WorkflowConnector" DROP COLUMN "nodeType",
ADD COLUMN     "nodeType" "ConnectorNodeType" NOT NULL,
DROP COLUMN "dataType",
ADD COLUMN     "dataType" "ConnectorDataType" NOT NULL;

-- DropEnum
DROP TYPE "WorkflowDataType";

-- DropEnum
DROP TYPE "WorkflowNodeType";
