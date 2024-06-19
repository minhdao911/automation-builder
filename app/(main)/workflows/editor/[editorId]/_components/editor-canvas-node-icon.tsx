import { WorkflowNodeDataType } from "@/lib/types";
import {
  BotMessageSquare,
  Calendar,
  Database,
  GitBranch,
  HardDrive,
  Mail,
  Slack,
  Timer,
} from "lucide-react";
import { FunctionComponent } from "react";

interface EditorCanvasNodeIconProps {
  type: WorkflowNodeDataType;
}

const EditorCanvasNodeIcon: FunctionComponent<EditorCanvasNodeIconProps> = ({
  type,
}) => {
  switch (type) {
    case WorkflowNodeDataType.Gmail:
      return <Mail className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.GoogleDrive:
      return <HardDrive className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.GoogleCalendar:
      return <Calendar className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.Condition:
      return <GitBranch className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.Slack:
      return <Slack className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.Notion:
      return <Database className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.Discord:
      return <BotMessageSquare className="flex-shrink-0" size={30} />;
    case WorkflowNodeDataType.TimeDelay:
      return <Timer className="flex-shrink-0" size={30} />;
    default:
      return <></>;
  }
};

export default EditorCanvasNodeIcon;
