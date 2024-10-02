import { Node } from "reactflow";
import { SettingsSectionWithEdit } from "../common";
import { WorkflowNodeData } from "@/model/types";
import { FunctionComponent, useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { searchPagesAndDatabases } from "@/lib/notion-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NotionDatabaseProperty,
  NotionMetadata,
  NotionParent,
  NotionParentType,
  EnrichedNotionDatabaseProperties,
} from "@/model/notion-schemas";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/stores/editor-store";
import { toast } from "@/components/ui/use-toast";
import ParentListOptions, { getCreateOption } from "./parent-list-options";
import PropertiesTable from "./properties-table";

interface NotionSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const createOptions = [
  { label: "New page under existing page", value: NotionParentType.Page },
  {
    label: "New page under existing database",
    value: NotionParentType.Database,
  },
];

export const NotionCreatePageSettings: FunctionComponent<
  NotionSettingsProps
> = ({ selectedNode }) => {
  const { connected, connectionKey, metadata } = selectedNode.data;
  const notionData = metadata?.notion;
  const { updateNode } = useEditorStore();

  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [parentList, setParentList] = useState<NotionParent[]>();

  const savedData = notionData
    ? [
        {
          name: `Parent ${getCreateOption(notionData.parentType)}`,
          value: notionData.parentName ?? "Untitled",
        },
        {
          name: "Title",
          value: notionData.icon
            ? `${notionData.icon} ${notionData.title}`
            : notionData.title,
        },
        { name: "Content", value: notionData.content },
      ]
    : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<NotionMetadata>({
    defaultValues: {
      parentId: notionData?.parentId,
      parentType: notionData?.parentType,
      title: notionData?.title,
      icon: notionData?.icon,
      content: notionData?.content,
    },
  });
  const icon = watch("icon");
  const parentId = watch("parentId");
  const parentType = watch("parentType");

  const getParentList = () => {
    startTransition(async () => {
      if (connected) {
        const list = await searchPagesAndDatabases(parentType, connectionKey);
        setParentList(list);
      }
    });
  };

  useEffect(() => {
    if (parentType) getParentList();
  }, [parentType]);

  const onSubmit = async (data: NotionMetadata) => {
    const updatedMetadata = {
      ...metadata,
      notion: {
        parentId: data.parentId,
        parentType: data.parentType,
        parentName: parentList?.find((p) => p.id === data.parentId)?.title,
        title: data.title,
        icon: data.icon,
        content: data.content,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  return (
    <>
      <SettingsSectionWithEdit
        title="Page Details"
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={handleSubmit(onSubmit)}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="createOption">Create options</Label>
            <Select
              value={parentType}
              disabled={!connected || isPending}
              onValueChange={(value) => {
                setValue("parentType", value as NotionParentType);
                clearErrors("parentType");
              }}
              {...register("parentType", { required: true })}
            >
              <SelectTrigger
                className={`${errors.parentType ? "border-red-500" : ""}`}
              >
                <SelectValue
                  id="createOption"
                  placeholder={
                    connected
                      ? "Select create page option"
                      : "No connection established"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {createOptions.map(({ label, value }, index) => (
                  <SelectItem key={index} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {parentType && (
            <>
              <ParentListOptions
                parentList={parentList}
                parentId={parentId}
                parentType={parentType}
                isPending={isPending}
                formProps={{ register, errors, clearErrors }}
                onRefresh={getParentList}
                onValueChange={(value) => {
                  setValue("parentId", value);
                }}
              />
              <div className="flex gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <EmojiPicker
                    emoji={icon}
                    onEmojiClick={(data) => {
                      setValue("icon", data.emoji);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="New page"
                    className={`${errors.title ? "border-red-500" : ""}`}
                    {...register("title", { required: true })}
                    aria-invalid={errors.title ? "true" : "false"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea rows={10} {...register("content")} />
              </div>
            </>
          )}
        </form>
      </SettingsSectionWithEdit>
    </>
  );
};

export const NotionCreateDatabaseSettings: FunctionComponent<
  NotionSettingsProps
> = ({ selectedNode }) => {
  const { connected, connectionKey, metadata } = selectedNode.data;
  const notionData = metadata?.notion;
  const { updateNode } = useEditorStore();

  const defaultProperties = [
    { name: "", type: EnrichedNotionDatabaseProperties.Title },
  ];
  const [edit, setEdit] = useState(false);
  const [properties, setProperties] = useState<NotionDatabaseProperty[]>(
    notionData?.properties ?? defaultProperties
  );
  const [parentList, setParentList] = useState<NotionParent[]>();
  const [isPending, startTransition] = useTransition();

  const savedData = notionData
    ? [
        {
          name: "Parent page",
          value: notionData.parentName ?? "Untitled",
        },
        {
          name: "Title",
          value: notionData.icon
            ? `${notionData.icon} ${notionData.title}`
            : notionData.title,
        },
      ]
    : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<NotionMetadata>({
    defaultValues: {
      parentId: notionData?.parentId,
      title: notionData?.title,
      icon: notionData?.icon,
    },
  });
  const parentId = watch("parentId");
  const icon = watch("icon");

  const getParentList = () => {
    startTransition(async () => {
      if (connected) {
        const list = await searchPagesAndDatabases(
          NotionParentType.Page,
          connectionKey
        );
        setParentList(list);
      }
    });
  };

  useEffect(() => {
    getParentList();
  }, []);

  const onSubmit = async (data: NotionMetadata) => {
    const hasValidProperties = properties.every(
      (prop) => prop.name && prop.type
    );
    if (!hasValidProperties) {
      toast({
        description: "Please make sure all properties' fields have values",
        variant: "destructive",
      });
      return;
    }

    const updatedMetadata = {
      ...metadata,
      notion: {
        parentId: data.parentId,
        parentType: NotionParentType.Page,
        parentName: parentList?.find((p) => p.id === data.parentId)?.title,
        title: data.title,
        properties,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const getSavedTableComp = () => {
    if (!notionData) return null;
    return <PropertiesTable properties={notionData.properties ?? []} />;
  };

  return (
    <>
      <SettingsSectionWithEdit
        title="Database Details"
        savedData={savedData}
        savedComponent={getSavedTableComp()}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={handleSubmit(onSubmit)}
      >
        <ParentListOptions
          parentList={parentList}
          parentId={parentId}
          isPending={isPending}
          formProps={{ register, errors, clearErrors }}
          onRefresh={getParentList}
          onValueChange={(value) => {
            setValue("parentId", value);
          }}
        />
        {parentId && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="icon">Icon</Label>
                <EmojiPicker
                  emoji={icon}
                  onEmojiClick={(data) => {
                    setValue("icon", data.emoji);
                  }}
                  onCancel={() => setValue("icon", "")}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="New page"
                  className={`${errors.title ? "border-red-500" : ""}`}
                  {...register("title", { required: true })}
                  aria-invalid={errors.title ? "true" : "false"}
                />
              </div>
            </div>
            <PropertiesTable
              isEdit
              properties={properties}
              setProperties={setProperties}
            />
          </div>
        )}
      </SettingsSectionWithEdit>
    </>
  );
};
