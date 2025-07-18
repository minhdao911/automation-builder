import CustomSheet, { CustomSheetTitle } from "@/components/ui/custom-sheet";
import { useEditorStore } from "@/stores/editor-store";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { FunctionComponent } from "react";
import { ConnectionSections, DetailsSection } from "./common";
import GoogleDriveSettings from "./google-drive-settings";
import {
  ConnectorDataType,
  ConnectorEvenType,
  ConnectorNodeType,
} from "@prisma/client";
import GmailSettings from "./gmail-settings";
import CalendarSettings from "./calendar-settings";
import {
  SlackMessageReceivedSettings,
  SlackSendMessageSettings,
} from "./slack-settings";
import {
  NotionCreatePageSettings,
  NotionCreateDatabaseSettings,
  NotionDeletePageSettings,
} from "./notion-settings";
import ConditionSettings from "./condition-settings";
import TimeDelaySettings from "./time-delay-settings";

interface EditorCanvasNodeSettingsProps {}

const EditorCanvasNodeSettings: FunctionComponent<
  EditorCanvasNodeSettingsProps
> = () => {
  const { open, setOpen } = useNodeModalStore();
  const { selectedNode } = useEditorStore();

  if (!selectedNode) return null;

  const contentHeight = window.innerHeight - 80 - 77;

  const { name, description, dataType, nodeType, eventType, connected } =
    selectedNode.data;
  const showConnectionSettings = nodeType !== ConnectorNodeType.Logical;

  const getSettingsBasedOnEventType = (type?: ConnectorEvenType | null) => {
    switch (type) {
      case ConnectorEvenType.GoogleDrive_FileChanged:
        return <GoogleDriveSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Gmail_SendEmail:
        return <GmailSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.GoogleCalendar_CreateEvent:
        return <CalendarSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Slack_SendMessage:
        return <SlackSendMessageSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Slack_MessageReceived:
        return <SlackMessageReceivedSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Notion_CreatePage:
        return <NotionCreatePageSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Notion_CreateDatabase:
        return <NotionCreateDatabaseSettings selectedNode={selectedNode} />;
      case ConnectorEvenType.Notion_DeletePageFromDatabase:
        return <NotionDeletePageSettings selectedNode={selectedNode} />;
      default:
        return null;
    }
  };

  const getSettingsBasedOnDataType = (type?: ConnectorDataType | null) => {
    switch (type) {
      case ConnectorDataType.Condition:
        return <ConditionSettings selectedNode={selectedNode} />;
      case ConnectorDataType.TimeDelay:
        return <TimeDelaySettings selectedNode={selectedNode} />;
      default:
        return null;
    }
  };

  return (
    <CustomSheet
      className="top-[80px]"
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className="p-6 border-b border-neutral-300 dark:border-neutral-800 shadow">
        <CustomSheetTitle>{name}</CustomSheetTitle>
      </div>
      <div
        style={{ height: contentHeight }}
        className={`overflow-auto p-3 flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-950`}
      >
        <DetailsSection
          id={selectedNode.id}
          name={name}
          description={description}
        />
        {showConnectionSettings && (
          <ConnectionSections connected={connected} dataType={dataType} />
        )}
        {getSettingsBasedOnEventType(eventType)}
        {getSettingsBasedOnDataType(dataType)}
      </div>
    </CustomSheet>
  );
};

export default EditorCanvasNodeSettings;
