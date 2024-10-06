import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";
import {
  DriveData,
  DriveDataType,
  DriveNotificationEventType,
} from "@/model/google-schemas";
import { CResponse, WorkflowNodeData } from "@/model/types";
import { useEffect, useState, useTransition } from "react";
import { SettingsSection } from "./common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn, fetcher, fetcherMutation } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/stores/editor-store";
import dayjs from "dayjs";
import { Node } from "reactflow";
import { Checkbox } from "@/components/ui/checkbox";

interface GoogleDriveSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const MAX_EXPIRATION = 86400;

const GoogleDriveSettings = ({ selectedNode }: GoogleDriveSettingsProps) => {
  const { updateNode } = useEditorStore();
  const [isPending, startTransition] = useTransition();

  const { connected, metadata } = selectedNode.data;
  const driveData = metadata?.googleDrive;

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
      <SettingsSection
        title={
          <div className="flex items-center justify-between">
            <p>Listener</p>
            {driveData && (
              <p className="text-red-500 text-sm">
                {dayjs().isAfter(dayjs(driveData.expiration)) ? "Expired" : ""}
              </p>
            )}
          </div>
        }
      >
        {driveData ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold capitalize">{driveData.type}</p>
              <p className="">{driveData.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Expiration date</p>
              <p className="">
                {dayjs(driveData.expiration).format("DD-MM-YYYY HH:mm:ss")}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Subscribed events</p>
              <p className="">{driveData.events.join(", ")}</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-5 w-full"
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
  const { data, isLoading } = useSWRImmutable<CResponse<DriveData[]>>(
    url,
    fetcher
  );
  const { isMutating, trigger } = useSWRMutation<CResponse<DriveData[]>>(
    url,
    fetcherMutation
  );
  const isPending = isLoading || isMutating;
  const driveFiles = data?.data || [];

  useEffect(() => {
    setSelectedItem(undefined);

    if (data?.error) {
      toast({
        description: `Failed to fetch ${driveDataType}s: ${data.error}`,
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              setSelectedItem(driveFiles.find((item) => item.id === value));
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
            {driveFiles.length > 0 && (
              <SelectContent>
                {driveFiles.map(({ id, name }) => (
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
