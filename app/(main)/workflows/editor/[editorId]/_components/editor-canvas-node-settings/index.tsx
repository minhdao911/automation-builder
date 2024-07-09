import { Button } from "@/components/ui/button";
import CustomSheet, { CustomSheetTitle } from "@/components/ui/custom-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/stores/editor-store";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { FunctionComponent, useEffect, useState } from "react";
import { SettingsSection } from "./common";
import GoogleDriveSettings from "./google-drive-settings";
import { ConnectorDataType } from "@prisma/client";

interface EditorCanvasNodeSettingsProps {}

const EditorCanvasNodeSettings: FunctionComponent<
  EditorCanvasNodeSettingsProps
> = () => {
  const { open, setOpen } = useNodeModalStore();
  const { selectedNode } = useEditorStore();

  if (!selectedNode) return null;

  const { name, description, dataType } = selectedNode.data;

  const getSettingsBasedOnType = (type: ConnectorDataType) => {
    switch (type) {
      case ConnectorDataType.GoogleDrive:
        return <GoogleDriveSettings selectedNodeData={selectedNode.data} />;
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
        {getSettingsBasedOnType(dataType)}
      </div>
    </CustomSheet>
  );
};

export default EditorCanvasNodeSettings;

const DetailsSection = ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string | null;
}) => {
  const { updateNode } = useEditorStore();

  const [nodeName, setName] = useState(name);
  const [nodeDescription, setDescription] = useState(description);

  useEffect(() => {
    setName(name);
    setDescription(description);
  }, [name, description]);

  const onSubmit = () => {
    if (!nodeName) return;
    updateNode(id, { name: nodeName, description: nodeDescription });
  };

  return (
    <SettingsSection title="Details">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={nodeName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={nodeDescription ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button size="sm" type="submit" variant="secondary" onClick={onSubmit}>
          Save
        </Button>
      </div>
    </SettingsSection>
  );
};
