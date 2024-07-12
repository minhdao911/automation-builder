import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import {
  DriveData,
  DriveDataType,
  DriveNotificationEventType,
} from "@/lib/google-schemas";
import { WorkflowNodeData } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
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
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/stores/editor-store";
import dayjs from "dayjs";
import { Node } from "reactflow";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface GoogleDriveSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const MAX_EXPIRATION = 86400;

const GoogleDriveSettings = ({ selectedNode }: GoogleDriveSettingsProps) => {
  const { connected, dataType, metadata } = selectedNode.data;
  const driveData = metadata?.googleDrive;

  const { updateNode } = useEditorStore();

  const [isPending, startTransition] = useTransition();

  const handleRemoveListener = () => {
    startTransition(async () => {
      const response = await fetch("/api/drive-activity", {
        method: "DELETE",
        body: JSON.stringify({
          channelId: driveData!.channelId,
          resourceId: driveData!.resourceId,
        }),
      });
      if (response.status === 200) {
        toast({
          description: "Listener removed successfully",
        });
        updateNode(selectedNode.id, {
          metadata: {
            ...selectedNode.data.metadata,
            googleDrive: undefined,
          },
        });
      } else {
        toast({
          description: (await response.json()).error,
          variant: "destructive",
        });
      }
    });
  };

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
        {driveData ? (
          <div>
            <p>
              <span className="capitalize text-sm">{driveData.type}:</span>{" "}
              <b>{driveData.name}</b>
            </p>
            <p>
              <span className="text-sm">Expiration Date:</span>{" "}
              <b>{dayjs(driveData.expiration).format("DD-MM-YYYY HH:mm:ss")}</b>
            </p>
            <p>
              <span className="text-sm">Subscribed Events:</span>{" "}
              <b>{driveData.events.join(", ")}</b>
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              onClick={handleRemoveListener}
            >
              {isPending ? <Loader /> : <span>Remove Listener</span>}
            </Button>
          </div>
        ) : (
          <CreateListenerSettings
            selectedNode={selectedNode}
            connected={connected}
          />
        )}
      </SettingsSection>
    </>
  );
};

export default GoogleDriveSettings;

const CreateListenerSettings = ({
  selectedNode,
  connected,
}: {
  selectedNode: Node<WorkflowNodeData>;
  connected: boolean;
}) => {
  const [driveDataType, setDriveDataType] = useState<DriveDataType>(
    DriveDataType.File
  );
  const [selectedItem, setSelectedItem] = useState<DriveData>();
  const [expiration, setExpiration] = useState(3600);
  const [notificationEvents, setNotificationEvents] = useState<
    DriveNotificationEventType[]
  >([]);

  const [isTransitionPending, startTransition] = useTransition();

  const { updateNode } = useEditorStore();

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

  const handleCreateListener = () => {
    if (!selectedItem) {
      toast({
        description: "Please select a file or folder",
      });
      return;
    }

    if (notificationEvents.length === 0) {
      toast({
        description: "Please select at least one event",
      });
      return;
    }

    const expirationInUnixMS = dayjs().add(expiration, "second").valueOf();
    startTransition(async () => {
      const response = await fetch("/api/drive-activity", {
        method: "POST",
        body: JSON.stringify({
          fileId: selectedItem.id,
          expiration: expirationInUnixMS,
        }),
      });
      if (response.status === 200) {
        toast({
          description: "Listener created successfully",
        });
        const listener = await response.json();
        console.log("listener", listener);
        updateNode(selectedNode.id, {
          metadata: {
            ...selectedNode.data.metadata,
            googleDrive: {
              name: selectedItem!.name,
              type: driveDataType,
              channelId: listener.id,
              resourceId: listener.resourceId,
              expiration: Number(listener.expiration),
              events: notificationEvents,
            },
          },
        });
      } else {
        toast({
          description: (await response.json()).error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col gap-2 col-span-1">
          <Label>Type</Label>
          <Select
            value={driveDataType}
            onValueChange={(value) => setDriveDataType(value as DriveDataType)}
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
      <div className="flex items-center gap-4 mt-3">
        <Label htmlFor="expiration" className="flex-shrink-0">
          <p>Expiration Time</p>
          <p>(Max {86400} secs)</p>
        </Label>
        <div className="flex items-center gap-2 w-full">
          <Input
            id="expiration"
            type="number"
            max={MAX_EXPIRATION}
            value={expiration}
            onChange={(e) => {
              const value = Number(e.target.value);
              setExpiration(value > MAX_EXPIRATION ? MAX_EXPIRATION : value);
            }}
          />
          <span className="text-sm">seconds</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Subscribed Events</p>
        </div>
        <ul className="mt-1 grid grid-cols-2">
          {Object.values(DriveNotificationEventType).map((type, index) => {
            return (
              <li key={index} className="flex items-center gap-1.5 mt-1">
                <Checkbox
                  id={type}
                  checked={notificationEvents.includes(type)}
                  onCheckedChange={(checked) => {
                    setNotificationEvents((prev) => {
                      if (checked) return [...prev, type];
                      return prev.filter((item) => item !== type);
                    });
                  }}
                />
                <label htmlFor={type} className="text-sm">
                  {type}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <Button size="sm" className="mt-5 w-full" onClick={handleCreateListener}>
        {isTransitionPending ? <Loader /> : <span>Create Listener</span>}
      </Button>
    </>
  );
};
