import { TimeUnit, WorkflowNodeData } from "@/model/types";
import { Node } from "reactflow";
import { SettingsSectionWithEdit } from "./common";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SimpleSelect } from "@/components/ui/select";
import { useEditorStore } from "@/stores/editor-store";
import { Label } from "@/components/ui/label";

interface TimeDelaySettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const timeUnitItems = Object.values(TimeUnit).map((unit) => ({
  label: unit,
  value: unit,
}));

const TimeDelaySettings = ({ selectedNode }: TimeDelaySettingsProps) => {
  const { updateNode } = useEditorStore();
  const { metadata } = selectedNode.data;
  const timeData = metadata?.timeDelay;

  const savedData = timeData
    ? [
        {
          name: "Delay",
          value: `${timeData.value} ${timeData.unit}${
            timeData.value > 1 ? "s" : ""
          }`,
        },
      ]
    : undefined;

  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState<number>(timeData?.value ?? 1);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(
    timeData?.unit ?? TimeUnit.Second
  );

  const handleSave = () => {
    const updatedMetadata = {
      ...metadata,
      timeDelay: {
        value: input,
        unit: timeUnit,
      },
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  return (
    <>
      <SettingsSectionWithEdit
        title="Time Details"
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={handleSave}
      >
        <Label>Delay</Label>
        <div className="flex items-center gap-3 mt-2">
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(+e.target.value)}
          />
          <SimpleSelect
            items={timeUnitItems}
            value={timeUnit}
            onValueChange={(value) => setTimeUnit(value as TimeUnit)}
          />
        </div>
      </SettingsSectionWithEdit>
    </>
  );
};

export default TimeDelaySettings;
