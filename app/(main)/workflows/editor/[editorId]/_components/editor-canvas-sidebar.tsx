import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowNodeDataType, WorkflowNodeType } from "@/lib/types";
import { FunctionComponent } from "react";
import EditorCanvasNodeIcon from "./editor-canvas-node-icon";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EDITOR_DEFAULT_NODES } from "@/lib/constants";

interface EditorCanvasSidebarProps {
  workflowName: string;
  onSave: () => void;
  // onPublish: () => void;
}

const EditorCanvasSidebar: FunctionComponent<EditorCanvasSidebarProps> = ({
  workflowName,
  onSave,
  // onPublish,
}) => {
  return (
    <aside>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">{workflowName}</h3>
        <div className="flex gap-3">
          <Button size="sm" variant="secondary" onClick={onSave}>
            Save
          </Button>
          <Button
            size="sm"
            variant="secondary"
            // onClick={onPublish}
          >
            Publish
          </Button>
        </div>
      </div>
      <Separator />
      <Tabs
        defaultValue={WorkflowNodeType.Trigger}
        className="w-[500px] h-screen overflow-scroll"
      >
        <TabsList className="w-full bg-transparent justify-start py-3 h-fit">
          <TabsTrigger value={WorkflowNodeType.Trigger}>Triggers</TabsTrigger>
          <TabsTrigger value={WorkflowNodeType.Action}>Actions</TabsTrigger>
          <TabsTrigger value={WorkflowNodeType.Logical}>Logicals</TabsTrigger>
        </TabsList>
        <div className="p-4">
          <TabsContent value={WorkflowNodeType.Trigger}>
            {EDITOR_DEFAULT_NODES.Trigger.map((data, index) => (
              <EditorCanvasSidebarCard
                key={index}
                {...data}
                nodeType={WorkflowNodeType.Trigger}
              />
            ))}
          </TabsContent>
          <TabsContent value={WorkflowNodeType.Action}>
            {EDITOR_DEFAULT_NODES.Action.map((data, index) => (
              <EditorCanvasSidebarCard
                key={index}
                {...data}
                nodeType={WorkflowNodeType.Action}
              />
            ))}
          </TabsContent>
          <TabsContent value={WorkflowNodeType.Logical}>
            {EDITOR_DEFAULT_NODES.Logical.map((data, index) => (
              <EditorCanvasSidebarCard
                key={index}
                {...data}
                nodeType={WorkflowNodeType.Logical}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;

interface EditorCanvasSidebarCardProps {
  id: string;
  title: string;
  description: string;
  type: WorkflowNodeDataType;
  nodeType: WorkflowNodeType;
}

const EditorCanvasSidebarCard = ({
  id,
  title,
  description,
  type,
  nodeType,
}: EditorCanvasSidebarCardProps) => {
  return (
    <Card
      draggable
      className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 mb-4"
      onDragStart={(event) => {
        event.dataTransfer.setData("nodeDataId", id);
        event.dataTransfer.setData("nodeType", nodeType);
      }}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <EditorCanvasNodeIcon type={type} />
        <CardTitle className="text-md">
          {title}
          <CardDescription>{description}</CardDescription>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
