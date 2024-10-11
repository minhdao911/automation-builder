import { FunctionComponent } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import { Connection } from "@prisma/client";
import { mapConnectionType } from "@/lib/utils";
import { ConnectionType } from "@/model/types";
import ConnectButton from "@/components/connect-button";
import WorkflowIconHelper from "@/components/workflow-icon-helper";

interface ConnectionCardProps {
  type: ConnectionType;
  description: string;
  connection: Connection | null;
}

const ConnectionCard: FunctionComponent<ConnectionCardProps> = ({
  type,
  description,
  connection,
}) => {
  const connectionMap = mapConnectionType(connection);

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <WorkflowIconHelper type={type} bgColor="transparent" />
          <p className="font-semibold">{getNameFromType(type)}</p>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connectionMap[type] ? (
          <div className="flex items-center font-bold text-white">
            Connected
            <CircleCheck size={24} className="ml-2 text-green-500" />
          </div>
        ) : (
          <ConnectButton dataType={type} />
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;

const getNameFromType = (type: ConnectionType) => {
  switch (type) {
    case ConnectionType.Gmail:
      return "Gmail";
    case ConnectionType.GoogleCalendar:
      return "Google Calendar";
    case ConnectionType.GoogleDrive:
      return "Google Drive";
    case ConnectionType.Slack:
      return "Slack";
    case ConnectionType.Notion:
      return "Notion";
    case ConnectionType.Discord:
      return "Discord";
    default:
      return "";
  }
};
