import { Node } from "reactflow";
import { SettingsSectionWithEdit } from "./common";
import { WorkflowNodeData } from "@/model/types";
import { FunctionComponent, useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchPagesAndDatabases } from "@/lib/notion-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NotionMetadata,
  NotionParent,
  NotionParentType,
} from "@/model/notion-schemas";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/stores/editor-store";

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
      icon: notionData?.icon ?? "😀",
      content: notionData?.content,
    },
  });
  const icon = watch("icon");
  const parentId = watch("parentId");
  const parentType = watch("parentType");

  const getParentList = () => {
    startTransition(async () => {
      if (connected) {
        const list = await searchPagesAndDatabases("page", connectionKey);
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
        title: data.title,
        icon: data.icon,
        content: data.content,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const getSavedComponent = () => {
    if (!notionData) return null;

    const { parentType, title, icon, content } = notionData;

    return (
      <div className="rounded bg-muted/50 p-4 min-h-[300px]">
        <div className="text-[36px]">{icon}</div>
        <h1 className="text-lg mt-3">{title}</h1>
        <div className="text-sm mt-2">
          <pre className="font-sans tracking-wide">{content}</pre>
        </div>
      </div>
    );
  };

  return (
    <>
      <SettingsSectionWithEdit
        title={`Page ${notionData ? "Preview" : "Details"}`}
        edit={edit}
        setEdit={setEdit}
        savedComponent={getSavedComponent()}
        onSaveClick={handleSubmit(onSubmit)}
      >
        <form
          className="flex flex-col gap-3"
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="parent" className="flex items-center gap-1.5">
                  <p>
                    <span className="capitalize">
                      {getCreateOption(parentType)}
                    </span>{" "}
                    list
                  </p>
                  <RefreshCcw
                    size={14}
                    className={cn(
                      "text-neutral-500 hover:text-neutral-400 cursor-pointer",
                      isPending && "animate-spin cursor-not-allowed"
                    )}
                    onClick={async () => {
                      if (!isPending) getParentList();
                    }}
                  />
                </Label>
                <Select
                  value={parentId}
                  disabled={isPending}
                  onValueChange={(value) => {
                    setValue("parentId", value);
                    clearErrors("parentId");
                  }}
                  {...register("parentId", { required: true })}
                >
                  <SelectTrigger
                    className={`${errors.parentId ? "border-red-500" : ""}`}
                  >
                    <SelectValue
                      id="parent"
                      placeholder={
                        parentList && parentList.length > 0
                          ? `Select parent ${getCreateOption(parentType)}`
                          : `No ${getCreateOption(parentType)} found`
                      }
                    />
                  </SelectTrigger>
                  {parentList && parentList.length > 0 && (
                    <SelectContent>
                      {parentList.map(({ id, title }) => (
                        <SelectItem key={id} value={id}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
              </div>
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

export default NotionCreatePageSettings;

const getCreateOption = (type: NotionParentType) => {
  return type === NotionParentType.Page ? "page" : "database";
};
