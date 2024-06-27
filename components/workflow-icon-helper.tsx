import { WorkflowNodeDataType } from "@/lib/types";
import { GitBranch, Timer, Zap } from "lucide-react";
import { FunctionComponent } from "react";
import Gmail from "./icons/gmail";
import Drive from "./icons/drive";
import Calendar from "./icons/calendar";
import Slack from "./icons/slack";
import Notion from "./icons/notion";
import Discord from "./icons/discord";

interface WorkflowIconHelperProps {
  type: WorkflowNodeDataType;
}

const WorkflowIconHelper: FunctionComponent<WorkflowIconHelperProps> = ({
  type,
}) => {
  switch (type) {
    case WorkflowNodeDataType.Gmail:
      // return <Mail className="flex-shrink-0" size={30} />;
      return <Gmail size={36} />;
    case WorkflowNodeDataType.GoogleDrive:
      return <Drive size={36} />;
    case WorkflowNodeDataType.GoogleCalendar:
      return <Calendar size={36} />;
    case WorkflowNodeDataType.Condition:
      return <GitBranch className="flex-shrink-0" size={28} />;
    case WorkflowNodeDataType.Slack:
      return <Slack size={36} />;
    case WorkflowNodeDataType.Notion:
      return <Notion size={36} />;
    case WorkflowNodeDataType.Discord:
      return <Discord size={36} />;
    case WorkflowNodeDataType.TimeDelay:
      return <Timer className="flex-shrink-0" size={28} />;
    default:
      return <Zap className="flex-shrink-0" size={28} />;
  }
};

export default WorkflowIconHelper;
