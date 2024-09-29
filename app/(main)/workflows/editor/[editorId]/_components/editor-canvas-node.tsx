import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkflowNodeData } from "@/model/types";
import { FunctionComponent } from "react";
import { NodeProps, Position, useNodeId } from "reactflow";
import CustomHandle from "./custom-handle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { ConnectorNodeType } from "@prisma/client";
import { mapConnectorDataType } from "@/lib/utils";

const EditorCanvasNode: FunctionComponent<NodeProps<WorkflowNodeData>> = ({
  type,
  data,
}) => {
  const { name, description, connected, selected, dataType } = data;
  const isLogicalNode = type === ConnectorNodeType.Logical;
  const nodeId = useNodeId();
  const { selectNode, removeNode } = useEditorStore();
  const { setOpen } = useNodeModalStore();

  if (!nodeId) return null;

  return (
    <div className="relative">
      {type !== ConnectorNodeType.Trigger && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      {selected && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute -top-3 -right-3 rounded-full w-8 h-8"
          onClick={() => {
            removeNode(nodeId);
            setOpen(false);
          }}
        >
          <Trash2 size={16} className="text-red-500" />
        </Button>
      )}
      <Card
        className={`text-left ${
          selected ? "border-neutral-400 dark:border-neutral-500" : ""
        }`}
        onClick={() => {
          selectNode(nodeId);
          setOpen(true);
        }}
      >
        <CardHeader className="p-4">
          <div className="flex gap-4 items-center">
            <WorkflowIconHelper type={dataType} />
            <div>
              <CardTitle className="text-md">{name}</CardTitle>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
          {!isLogicalNode && (
            <div className="flex gap-2 pt-1.5">
              <Badge
                variant="secondary"
                className="text-neutral-600 dark:text-neutral-400"
              >
                {mapConnectorDataType(dataType)}
              </Badge>
              <Badge
                variant="secondary"
                className={`${
                  connected ? "text-green-500" : "text-orange-500"
                }`}
              >
                {connected ? "Connected" : "Not connected"}
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>
      <CustomHandle type="source" position={Position.Bottom} />
    </div>
  );
};

export default EditorCanvasNode;
