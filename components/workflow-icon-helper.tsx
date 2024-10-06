import { GitBranch, Timer, Zap } from "lucide-react";
import { FunctionComponent } from "react";
import Gmail from "./icons/gmail";
import Drive from "./icons/drive";
import Calendar from "./icons/calendar";
import Slack from "./icons/slack";
import Notion from "./icons/notion";
import Discord from "./icons/discord";
import { ConnectorDataType } from "@prisma/client";

interface WorkflowIconHelperProps {
  type: ConnectorDataType;
  size?: "base" | "sm";
  bgColor?: string;
}

const WorkflowIconHelper: FunctionComponent<WorkflowIconHelperProps> = ({
  type,
  size,
  bgColor,
}) => {
  let sizes = [36, 28];
  if (size === "sm") {
    sizes = [24, 16];
  }

  switch (type) {
    case ConnectorDataType.Gmail:
      return <Gmail className="shadow-lg" size={sizes[0]} bgColor={bgColor} />;
    case ConnectorDataType.GoogleDrive:
      return <Drive className="shadow-lg" size={sizes[0]} bgColor={bgColor} />;
    case ConnectorDataType.GoogleCalendar:
      return (
        <Calendar className="shadow-lg" size={sizes[0]} bgColor={bgColor} />
      );
    case ConnectorDataType.Condition:
      return <GitBranch className="flex-shrink-0" size={sizes[1]} />;
    case ConnectorDataType.Slack:
      return <Slack className="shadow-lg" size={sizes[0]} bgColor={bgColor} />;
    case ConnectorDataType.Notion:
      return <Notion className="shadow-lg" size={sizes[0]} bgColor={bgColor} />;
    case ConnectorDataType.Discord:
      return (
        <Discord className="shadow-lg" size={sizes[0]} bgColor={bgColor} />
      );
    case ConnectorDataType.TimeDelay:
      return <Timer className="flex-shrink-0" size={sizes[1]} />;
    default:
      return <Zap className="flex-shrink-0" size={sizes[1]} />;
  }
};

export default WorkflowIconHelper;
