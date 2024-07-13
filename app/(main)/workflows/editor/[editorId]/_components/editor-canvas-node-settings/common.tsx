import { Button } from "@/components/ui/button";
import { CustomSheetSectionTitle } from "@/components/ui/custom-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { mapConnectorDataType } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { ConnectorDataType } from "@prisma/client";
import { useEffect, useState } from "react";

export const SettingsSection = ({
  title,
  children,
}: {
  title: string | React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <section className="p-4 bg-background border rounded-lg">
      <CustomSheetSectionTitle className="mb-3">
        {title}
      </CustomSheetSectionTitle>
      {children}
    </section>
  );
};

export const DetailsSection = ({
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
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setName(name);
    setDescription(description);
  }, [name, description]);

  const onSubmit = () => {
    if (!nodeName) return;
    updateNode(id, { name: nodeName, description: nodeDescription });
    setEdit(false);
  };

  return (
    <SettingsSection title="Details">
      {edit ? (
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
          <Button
            size="sm"
            type="submit"
            variant="secondary"
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-14">Name</p>
            <p className="">{name}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold w-14">Description</p>
            <p className={`${description ? "" : "italic text-neutral-400"}`}>
              {description ?? "No description"}
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>
        </div>
      )}
    </SettingsSection>
  );
};

export const ConnectionSections = ({
  dataType,
  connected,
}: {
  dataType: ConnectorDataType;
  connected: boolean;
}) => {
  return (
    <SettingsSection title="Connection">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <WorkflowIconHelper type={dataType} bgColor="transparent" />
          <span>{mapConnectorDataType(dataType)}</span>
        </div>
        {connected ? (
          <div className="text-sm font-semibold text-green-500">Connected</div>
        ) : (
          <Button size="sm">Connect</Button>
        )}
      </div>
    </SettingsSection>
  );
};
