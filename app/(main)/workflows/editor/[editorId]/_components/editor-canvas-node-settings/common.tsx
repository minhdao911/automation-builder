import ConnectButton from "@/app/(main)/connections/_components/connect-button";
import { Button } from "@/components/ui/button";
import { CustomSheetSectionTitle } from "@/components/ui/custom-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { mapConnectorDataType } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { ConnectorDataType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export const SettingsSection = ({
  title,
  editable,
  children,
  onEditClick,
}: {
  title: string | React.ReactNode;
  editable?: boolean;
  children?: React.ReactNode;
  onEditClick?: (isEdit: boolean) => void;
}) => {
  return (
    <section className="p-4 bg-background border rounded-lg">
      <CustomSheetSectionTitle className="mb-4">
        <div className="flex items-center justify-between">
          <p>{title}</p>
          {editable && (
            <Pencil
              size={16}
              className="text-muted-foreground hover:text-white cursor-pointer"
              onClick={onEditClick?.bind(this, true)}
            />
          )}
        </div>
      </CustomSheetSectionTitle>
      {children}
    </section>
  );
};

export const SettingsSectionWithEdit = ({
  title,
  edit,
  savedData,
  children,
  actionButton,
  mainButton,
  disabled,
  savedComponent,
  setEdit,
  onSaveClick,
}: {
  title: string | React.ReactNode;
  edit: boolean;
  savedData?: {
    name: string;
    value?: string | null;
  }[];
  children?: React.ReactNode;
  actionButton?: React.ReactNode;
  mainButton?: React.ReactNode;
  disabled?: boolean;
  savedComponent?: React.ReactNode;
  setEdit: (edit: boolean) => void;
  onSaveClick?: () => void;
}) => {
  const showEdit = edit || (!savedData && !savedComponent);

  return (
    <SettingsSection title={title} editable={!showEdit} onEditClick={setEdit}>
      {showEdit ? (
        <>
          {children}
          <div className="flex gap-3 mt-5 justify-end">
            {actionButton}
            {mainButton ?? (
              <Button size="sm" disabled={disabled} onClick={onSaveClick}>
                Save
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {savedData?.map(({ name, value }, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <p className="font-semibold">{name}</p>
                <pre
                  className={`text-sm ${
                    value ? "" : "italic text-neutral-400"
                  }`}
                >
                  {value || `No ${name}`}
                </pre>
              </div>
            ))}
          </div>
          {savedComponent}
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
      title="Node Details"
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
