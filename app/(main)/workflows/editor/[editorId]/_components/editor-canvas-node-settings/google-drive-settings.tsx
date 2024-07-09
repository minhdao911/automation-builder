import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import { DriveData, DriveDataType } from "@/lib/google-schemas";
import { WorkflowNodeData } from "@/lib/types";
import { useEffect, useState } from "react";
import { SettingsSection } from "./common";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  cn,
  fetcher,
  fetcherMutation,
  mapConnectorDataType,
} from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";

interface GoogleDriveSettingsProps {
  selectedNodeData: WorkflowNodeData;
}

const GoogleDriveSettings = ({
  selectedNodeData,
}: GoogleDriveSettingsProps) => {
  const { connected, dataType } = selectedNodeData;

  const [driveDataType, setDriveDataType] = useState<DriveDataType>(
    DriveDataType.File
  );
  const [selectedItem, setSelectedItem] = useState<DriveData>();

  const url = `/api/drive/${driveDataType}`;

  const { data, error, isLoading } = useSWRImmutable<DriveData[]>(url, fetcher);
  const {
    error: mutationError,
    isMutating,
    trigger,
  } = useSWRMutation<DriveData[]>(url, fetcherMutation);
  const isPending = isLoading || isMutating;

  if (error || mutationError) {
    toast({
      description: `Failed to fetch ${driveDataType}s`,
      variant: "destructive",
    });
  }

  useEffect(() => {
    setSelectedItem(undefined);
  }, [data]);

  return (
    <>
      <SettingsSection title="Connection">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <WorkflowIconHelper type={dataType} bgColor="transparent" />
            <span>{mapConnectorDataType(dataType)}</span>
          </div>
          {connected ? (
            <div className="text-sm font-semibold text-green-500">
              Connected
            </div>
          ) : (
            <Button size="sm">Connect</Button>
          )}
        </div>
      </SettingsSection>
      <SettingsSection title="Listener">
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-2 col-span-1">
            <Label>Type</Label>
            <Select
              value={driveDataType}
              onValueChange={(value) =>
                setDriveDataType(value as DriveDataType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DriveDataType.File}>File</SelectItem>
                <SelectItem value={DriveDataType.Folder}>Folder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 col-span-3">
            <Label className="flex items-center gap-1.5">
              <span>Data</span>
              <RefreshCcw
                size={14}
                className={cn(
                  "text-neutral-500 hover:text-neutral-400 cursor-pointer",
                  isPending && "animate-spin cursor-not-allowed"
                )}
                onClick={async () => {
                  if (!isPending) await trigger();
                }}
              />
            </Label>
            <Select
              value={selectedItem?.id}
              disabled={!connected || isPending}
              onValueChange={(value) => {
                setSelectedItem(data?.find((item) => item.id === value));
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    connected
                      ? `Select ${driveDataType} to listen for changes`
                      : "No connection established"
                  }
                />
              </SelectTrigger>
              {data && data.length > 0 && (
                <SelectContent>
                  {data.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
        </div>
        <Button size="sm" className="mt-3 w-full">
          Create Listener
        </Button>
      </SettingsSection>
    </>
  );
};

export default GoogleDriveSettings;
