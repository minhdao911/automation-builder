import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { SettingsSectionWithEdit } from "./common";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SlackChannel, SlackChannelType } from "@/model/slack-schemas";
import { Node } from "reactflow";
import { WorkflowNodeData } from "@/model/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getChannels, sendMessage } from "@/lib/slack-helpers";
import Loader from "@/components/ui/loader";
import { useEditorStore } from "@/stores/editor-store";

interface SlackSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

export const SlackSendMessageSettings: FunctionComponent<
  SlackSettingsProps
> = ({ selectedNode }) => {
  const { connected, connectionKey, metadata } = selectedNode.data;
  const slackData = metadata?.slack;
  const { updateNode } = useEditorStore();

  const [channels, setChannels] = useState<SlackChannel[]>();
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel>();
  const [message, setMessage] = useState(slackData?.text || "");
  const [isSending, setIsSending] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const savedData = slackData
    ? [
        {
          name: "Slack channel",
          value: `${getChannelSign(slackData.channelType)} ${
            slackData.channelName
          }`,
        },
        { name: "Slack message", value: slackData.text },
      ]
    : undefined;

  const getChannelList = () => {
    startTransition(async () => {
      if (connected) {
        const response = await getChannels(connectionKey);
        if (response.error) {
          toast({
            description: response.message,
            variant: "destructive",
          });
        }
        setChannels(response.data);
      }
    });
  };

  useEffect(() => {
    getChannelList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateSlackData = () => {
    if (!selectedChannel) {
      toast({
        description: "Please select a channel",
      });
      return false;
    }
    if (!message) {
      toast({
        description: "Please enter a message",
      });
      return false;
    }
    return true;
  };

  const onSendMessage = async () => {
    if (validateSlackData()) {
      setIsSending(true);
      const success = await sendMessage(
        selectedChannel!.id,
        message,
        connectionKey
      );
      if (success) {
        setIsSending(false);
        toast({
          description: "Message sent successfully",
        });
      } else {
        toast({
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    }
  };

  const onSave = () => {
    if (validateSlackData()) {
      const updatedMetadata = {
        ...metadata,
        slack: {
          channelId: selectedChannel!.id,
          channelName: selectedChannel!.name,
          channelType: selectedChannel!.type,
          text: message,
        },
      };
      updateNode(selectedNode.id, { metadata: updatedMetadata });
      setEdit(false);
    }
  };

  return (
    <>
      <SettingsSectionWithEdit
        title="Message Details"
        actionButton={
          <Button
            size="sm"
            variant="secondary"
            disabled={
              slackData?.channelType === SlackChannelType.Im ||
              selectedChannel?.type === SlackChannelType.Im
            }
            onClick={onSendMessage}
          >
            {isSending ? <Loader /> : <>Send test email</>}
          </Button>
        }
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={onSave}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="channel" className="flex items-center gap-1.5">
              <span>Slack channel</span>
              <RefreshCcw
                size={14}
                className={cn(
                  "text-neutral-500 hover:text-neutral-400 cursor-pointer",
                  isPending && "animate-spin cursor-not-allowed"
                )}
                onClick={async () => {
                  if (!isPending) getChannelList();
                }}
              />
            </Label>
            <Select
              value={selectedChannel?.id}
              disabled={!connected || isPending}
              onValueChange={(value) => {
                setSelectedChannel(channels?.find((item) => item.id === value));
              }}
            >
              <SelectTrigger>
                <SelectValue
                  id="channel"
                  placeholder={
                    connected
                      ? "Select Slack channel"
                      : "No connection established"
                  }
                />
              </SelectTrigger>
              {channels && channels.length > 0 && (
                <SelectContent>
                  {channels.map(({ id, name, type }) => (
                    <SelectItem key={id} value={id}>
                      {getChannelSign(type)} {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </SettingsSectionWithEdit>
    </>
  );
};

export const SlackMessageReceivedSettings: FunctionComponent<
  SlackSettingsProps
> = ({ selectedNode }) => {
  const { connected, connectionKey, metadata } = selectedNode.data;
  const slackData = metadata?.slack;
  const { updateNode } = useEditorStore();

  const [channels, setChannels] = useState<SlackChannel[]>();
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel>();
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const savedData = slackData
    ? [
        {
          name: "Slack channel",
          value: `${getChannelSign(slackData.channelType)} ${
            slackData.channelName
          }`,
        },
      ]
    : undefined;
  const showEdit = edit || !savedData;

  const getChannelList = () => {
    startTransition(async () => {
      if (connected) {
        const response = await getChannels(connectionKey);
        if (response.error) {
          toast({
            description: response.error,
            variant: "destructive",
          });
        }
        setChannels(response.data);
      }
    });
  };

  useEffect(() => {
    getChannelList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateListener = () => {
    if (!selectedChannel) {
      toast({
        description: "Please select a channel",
      });
      return;
    }
    const updatedMetadata = {
      ...metadata,
      slack: {
        channelId: selectedChannel!.id,
        channelName: selectedChannel!.name,
        channelType: selectedChannel!.type,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const onMainButtonClick = useCallback(() => {
    if (showEdit) {
      onCreateListener();
    } else {
      setEdit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEdit, selectedChannel]);

  return (
    <>
      <SettingsSectionWithEdit
        title="Listener"
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        mainButton={
          <Button size="sm" className="w-full" onClick={onMainButtonClick}>
            {showEdit ? "Create Listener" : "Remove Listener"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="channel" className="flex items-center gap-1.5">
              <span>Slack channel</span>
              <RefreshCcw
                size={14}
                className={cn(
                  "text-neutral-500 hover:text-neutral-400 cursor-pointer",
                  isPending && "animate-spin cursor-not-allowed"
                )}
                onClick={async () => {
                  if (!isPending) getChannelList();
                }}
              />
            </Label>
            <Select
              value={selectedChannel?.id}
              disabled={!connected || isPending}
              onValueChange={(value) => {
                setSelectedChannel(channels?.find((item) => item.id === value));
              }}
            >
              <SelectTrigger>
                <SelectValue
                  id="channel"
                  placeholder={
                    connected
                      ? "Select Slack channel"
                      : "No connection established"
                  }
                />
              </SelectTrigger>
              {channels && channels.length > 0 && (
                <SelectContent>
                  {channels.map(({ id, name, type }) => (
                    <SelectItem key={id} value={id}>
                      {getChannelSign(type)} {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
        </div>
      </SettingsSectionWithEdit>
    </>
  );
};

const getChannelSign = (type: SlackChannelType) => {
  return type === SlackChannelType.Channel ? "#" : "@";
};
