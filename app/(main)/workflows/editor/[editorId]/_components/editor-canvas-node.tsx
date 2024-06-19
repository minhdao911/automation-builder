import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkflowNodeData, WorkflowNodeType } from "@/lib/types";
import { FunctionComponent } from "react";
import EditorCanvasNodeIcon from "./editor-canvas-node-icon";
import { NodeProps, Position } from "reactflow";
import CustomHandle from "./custom-handle";
import { Badge } from "@/components/ui/badge";
import StatusDot from "@/components/ui/status-dot";

const EditorCanvasNode: FunctionComponent<NodeProps<WorkflowNodeData>> = ({
  type,
  data,
}) => {
  const { title, description, connected } = data;

  return (
    <div>
      {type !== WorkflowNodeType.Trigger && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <Card className="relative">
        {type !== WorkflowNodeType.Logical && (
          <StatusDot available={connected} className="absolute top-3 left-3" />
        )}
        <Badge variant="secondary" className="absolute top-2 right-2">
          {data.type}
        </Badge>
        <CardHeader>
          <div className="flex gap-4 p-3 items-center">
            <EditorCanvasNodeIcon type={data.type} />
            <div>
              <CardTitle className="text-md">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <CustomHandle type="source" position={Position.Bottom} />
    </div>
  );
};

export default EditorCanvasNode;
