import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  NotionMetadata,
  NotionParent,
  NotionParentType,
} from "@/model/notion-schemas";
import { RefreshCcw } from "lucide-react";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from "react-hook-form";

const ParentListOptions = ({
  parentList,
  parentId,
  parentType = NotionParentType.Page,
  isPending,
  formProps,
  onRefresh,
  onValueChange,
}: {
  parentList?: NotionParent[];
  parentId: string;
  parentType?: NotionParentType;
  isPending: boolean;
  formProps?: {
    register: UseFormRegister<NotionMetadata>;
    errors: FieldErrors<NotionMetadata>;
    clearErrors: UseFormClearErrors<NotionMetadata>;
  };
  onRefresh: () => void;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="parent" className="flex items-center gap-1.5">
        <p>
          <span className="capitalize">{getCreateOption(parentType)}</span> list
        </p>
        <RefreshCcw
          size={14}
          className={cn(
            "text-neutral-500 hover:text-neutral-400 cursor-pointer",
            isPending && "animate-spin cursor-not-allowed"
          )}
          onClick={async () => {
            if (!isPending) onRefresh();
          }}
        />
      </Label>
      <Select
        value={parentId}
        disabled={isPending}
        onValueChange={(value) => {
          onValueChange(value);
          formProps?.clearErrors("parentId");
        }}
        {...formProps?.register("parentId", { required: true })}
      >
        <SelectTrigger
          className={`${formProps?.errors.parentId ? "border-red-500" : ""}`}
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
  );
};

export default ParentListOptions;

export const getCreateOption = (type: NotionParentType) => {
  return type === NotionParentType.Page ? "page" : "database";
};
