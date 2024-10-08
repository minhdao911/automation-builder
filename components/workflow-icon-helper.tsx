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
  size?: "base" | "sm" | "xl";
  bgColor?: string;
}

const WorkflowIconHelper: FunctionComponent<WorkflowIconHelperProps> = ({
  type,
  size = "base",
  bgColor,
}) => {
  const sizes = {
    base: [36, 28],
    sm: [24, 16],
    xl: [48, 36],
  };
  const styles = {
    logo: "dark:shadow-lg",
    icon: "flex-shrink-0",
  };

  switch (type) {
    case ConnectorDataType.Gmail:
      return (
        <Gmail
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.GoogleDrive:
      return (
        <Drive
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.GoogleCalendar:
      return (
        <Calendar
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.Condition:
      return <GitBranch className={styles.icon} size={sizes[size][1]} />;
    case ConnectorDataType.Slack:
      return (
        <Slack
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.Notion:
      return (
        <Notion
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.Discord:
      return (
        <Discord
          className={styles.logo}
          size={sizes[size][0]}
          bgColor={bgColor}
        />
      );
    case ConnectorDataType.TimeDelay:
      return <Timer className={styles.icon} size={sizes[size][1]} />;
    default:
      return <Zap className={styles.icon} size={sizes[size][1]} />;
  }
};

export default WorkflowIconHelper;
