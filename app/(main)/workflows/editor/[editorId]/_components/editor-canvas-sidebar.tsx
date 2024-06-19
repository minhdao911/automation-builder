import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EDITOR_DEFAULT_CARDS } from "@/lib/constants";
import { WorkflowNodeDataType, WorkflowNodeType } from "@/lib/types";
import { FunctionComponent } from "react";
import EditorCanvasNodeIcon from "./editor-canvas-node-icon";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface EditorCanvasSidebarProps {
  workflowName: string;
}

const EditorCanvasSidebar: FunctionComponent<EditorCanvasSidebarProps> = ({
  workflowName,
}) => {
  return (
    <aside>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">{workflowName}</h3>
        <div className="flex gap-3">
          <Button size="sm" variant="secondary">
            Save
          </Button>
          <Button size="sm" variant="secondary">
            Publish
          </Button>
        </div>
      </div>
      <Separator />
      <Tabs
        defaultValue={WorkflowNodeType.Action}
        className="w-[500px] h-screen overflow-scroll"
      >
        <TabsList className="w-full bg-transparent justify-start py-3 h-fit">
          <TabsTrigger value={WorkflowNodeType.Action}>Actions</TabsTrigger>
          <TabsTrigger value={WorkflowNodeType.Trigger}>Triggers</TabsTrigger>
          <TabsTrigger value={WorkflowNodeType.Logical}>Logicals</TabsTrigger>
        </TabsList>
        <div className="p-4">
          <TabsContent value={WorkflowNodeType.Action}>
            {EDITOR_DEFAULT_CARDS.Action.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
          <TabsContent value={WorkflowNodeType.Trigger}>
            {EDITOR_DEFAULT_CARDS.Trigger.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
          <TabsContent value={WorkflowNodeType.Logical}>
            {EDITOR_DEFAULT_CARDS.Logical.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;

interface EditorCanvasSidebarCardProps {
  title: string;
  description: string;
  type: WorkflowNodeDataType;
}

const EditorCanvasSidebarCard = ({
  title,
  description,
  type,
}: EditorCanvasSidebarCardProps) => {
  return (
    <Card
      draggable
      className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 mb-4"
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
