import ConnectButton from "@/components/connect-button";
import { Button } from "@/components/ui/button";
import { CustomSheetSectionTitle } from "@/components/ui/custom-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { mapConnectorDataType } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { ConnectorDataType } from "@prisma/client";
import Link from "next/link";
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

export const SettingsSectionWithEdit = ({
  title,
  savedData,
  children,
  actionButton,
  edit,
  setEdit,
  onSaveClick,
}: {
  title: string | React.ReactNode;
  savedData?: {
    name: string;
    value?: string | null;
  }[];
  children?: React.ReactNode;
  actionButton?: React.ReactNode;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  onSaveClick: () => void;
}) => {
  const showEdit = edit || !savedData;

  return (
    <SettingsSection title={title}>
      {showEdit ? (
        <>
          {children}
          <div className="flex gap-3 justify-end mt-5">
            {actionButton}
            <Button type="submit" size="sm" onClick={onSaveClick}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {savedData?.map(({ name, value }) => (
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{name}</p>
                <p className={`${value ? "" : "italic text-neutral-400"}`}>
                  {value || `No ${name}`}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-end mt-5">
            {actionButton}
            <Button size="sm" variant="secondary" onClick={() => setEdit(true)}>
              Edit
            </Button>
          </div>
        </>
      )}
    </SettingsSection>
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

  const savedData = [
    { name: "Name", value: name },
    { name: "Description", value: description },
  ];

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
    <SettingsSectionWithEdit
      title="Details"
      savedData={savedData}
      edit={edit}
      setEdit={setEdit}
      onSaveClick={onSubmit}
    >
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
      </div>
    </SettingsSectionWithEdit>
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
          <ConnectButton size="sm" dataType={dataType} />
        )}
      </div>
    </SettingsSection>
  );
};
