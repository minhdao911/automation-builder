import CustomSheet, { CustomSheetTitle } from "@/components/ui/custom-sheet";
import { useEditorStore } from "@/stores/editor-store";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { FunctionComponent } from "react";
import { ConnectionSections, DetailsSection } from "./common";
import GoogleDriveSettings from "./google-drive-settings";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import GmailSettings from "./gmail-settings";

interface EditorCanvasNodeSettingsProps {}

const EditorCanvasNodeSettings: FunctionComponent<
  EditorCanvasNodeSettingsProps
> = () => {
  const { open, setOpen } = useNodeModalStore();
  const { selectedNode } = useEditorStore();

  if (!selectedNode) return null;

  const { name, description, dataType, nodeType, connected } =
    selectedNode.data;
  const showConnectionSettings = nodeType !== ConnectorNodeType.Logical;

  const getSettingsBasedOnType = (type: ConnectorDataType) => {
    switch (type) {
      case ConnectorDataType.GoogleDrive:
        return <GoogleDriveSettings selectedNode={selectedNode} />;
      case ConnectorDataType.Gmail:
        return <GmailSettings selectedNode={selectedNode} />;
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
      <div className="p-6 border-b border-neutral-800 shadow">
        <CustomSheetTitle>{name}</CustomSheetTitle>
      </div>
      <div className="p-3 flex flex-col gap-3">
        <DetailsSection
          id={selectedNode.id}
          name={name}
          description={description}
        />
        {showConnectionSettings && (
          <ConnectionSections connected={connected} dataType={dataType} />
        )}
        {getSettingsBasedOnType(dataType)}
      </div>
    </CustomSheet>
  );
};

export default EditorCanvasNodeSettings;
