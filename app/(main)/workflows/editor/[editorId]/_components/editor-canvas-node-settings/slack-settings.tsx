import { FunctionComponent, useEffect, useState, useTransition } from "react";
import { SettingsSection } from "./common";
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
import { SlackChannel } from "@/lib/slack-schemas";
import { Node } from "reactflow";
import { WorkflowNodeData } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getChannels, sendMessage } from "@/lib/slack-helpers";
import Loader from "@/components/ui/loader";
import { useEditorStore } from "@/stores/editor-store";

interface SlackSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const SlackSettings: FunctionComponent<SlackSettingsProps> = ({
  selectedNode,
}) => {
  const { connected, connectionKey, metadata } = selectedNode.data;
  const slackData = metadata?.slack;
  const { updateNode } = useEditorStore();

  const [channels, setChannels] = useState<SlackChannel[]>();
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel>();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const showEdit = edit || !slackData;

  const getChannelList = () => {
    startTransition(async () => {
      const response = await getChannels(connectionKey);
      if (response.error) {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
      setChannels(response.data);
    });
  };

  useEffect(() => {
    getChannelList();
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
          text: message,
        },
      };
      updateNode(selectedNode.id, { metadata: updatedMetadata });
      setEdit(false);
    }
  };

  return (
    <>
      <SettingsSection title="Message Details">
        {showEdit ? (
          <div className="flex flex-col gap-3">
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
                  setSelectedChannel(
                    channels?.find((item) => item.id === value)
                  );
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
                    {channels.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
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
            <div className="flex gap-3 justify-end">
              <Button size="sm" variant="secondary" onClick={onSendMessage}>
                {isSending ? <Loader /> : <>Send test email</>}
              </Button>
              <Button size="sm" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Slack channel</p>
              <p className=""># {slackData?.channelName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Slack message</p>
              <p className="">{slackData?.text}</p>
            </div>
            <div className="flex gap-3 justify-end mt-10">
              <Button size="sm" variant="secondary" onClick={onSendMessage}>
                {isSending ? <Loader /> : <>Send test message</>}
              </Button>
              <Button size="sm" onClick={() => setEdit(true)}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>
    </>
  );
};

export default SlackSettings;
