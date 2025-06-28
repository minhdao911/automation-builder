import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunctionComponent } from "react";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
import { WorkflowConnectorEnriched } from "@/model/types";
import { mapConnectorDataType } from "@/lib/utils";
import EditorCanvasVariablesTab from "./editor-canvas-variables-tab";

interface EditorCanvasSidebarProps {
  connectors: WorkflowConnectorEnriched[];
}

const EditorCanvasSidebar: FunctionComponent<EditorCanvasSidebarProps> = ({
  connectors,
}) => {
  const triggers = connectors.filter(
    (d) => d.nodeType === ConnectorNodeType.Trigger
  );
  const actions = connectors.filter(
    (d) => d.nodeType === ConnectorNodeType.Action
  );
  const logicals = connectors.filter(
    (d) => d.nodeType === ConnectorNodeType.Logical
  );

  return (
    <aside>
      <Tabs
        defaultValue={ConnectorNodeType.Trigger}
        className="w-full h-screen overflow-scroll bg-background"
      >
        <TabsList className="w-full bg-transparent justify-start py-3 h-fit">
          <TabsTrigger value={ConnectorNodeType.Trigger}>Triggers</TabsTrigger>
          <TabsTrigger value={ConnectorNodeType.Action}>Actions</TabsTrigger>
          <TabsTrigger value={ConnectorNodeType.Logical}>Logicals</TabsTrigger>
          <TabsTrigger value="Variable">Variables</TabsTrigger>
        </TabsList>
        <div className="p-4">
          <TabsContent value={ConnectorNodeType.Trigger}>
            {triggers.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
          <TabsContent value={ConnectorNodeType.Action}>
            {actions.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
          <TabsContent value={ConnectorNodeType.Logical}>
            {logicals.map((data, index) => (
              <EditorCanvasSidebarCard key={index} {...data} />
            ))}
          </TabsContent>
          <TabsContent value="Variable">
            <EditorCanvasVariablesTab />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;

interface EditorCanvasSidebarCardProps {
  id: string;
  name: string;
  nodeType: ConnectorNodeType;
  dataType: ConnectorDataType;
}

const EditorCanvasSidebarCard = ({
  id,
  name,
  nodeType,
  dataType,
}: EditorCanvasSidebarCardProps) => (
  <Card
    draggable
    className="w-full cursor-grab border-neutral-200 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 mb-4"
    onDragStart={(event) => {
      event.dataTransfer.setData("nodeDataId", id);
      event.dataTransfer.setData("nodeType", nodeType);
    }}
  >
    <CardHeader className="flex flex-row items-center gap-4 p-2.5 px-4">
      <WorkflowIconHelper type={dataType} />
      <CardTitle className="text-md !m-0">
        {name}
        <CardDescription className="text-xs">
          {mapConnectorDataType(dataType)}
        </CardDescription>
      </CardTitle>
    </CardHeader>
  </Card>
);
