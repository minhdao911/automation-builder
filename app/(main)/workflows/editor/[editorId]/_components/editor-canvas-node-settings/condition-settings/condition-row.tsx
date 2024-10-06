import {
  LogicalComparisionOperator,
  LogicalConnectionOperator,
  VariableType,
} from "@/model/types";
import { CirclePlus, Trash2 } from "lucide-react";
import { SimpleSelectProps, SimpleSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ConnectorDataType } from "@prisma/client";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { memo } from "react";
import { Button } from "@/components/ui/button";

interface ConditionRowProps {
  variable?: VariableType;
  operator: LogicalComparisionOperator;
  input: string;
}

export const ConditionRow = ({
  variable,
  operator,
  input,
  variableList,
  onChange,
  removeCondition,
}: ConditionRowProps & {
  variableList: VariableType[];
  onChange: (type: "variable" | "operator" | "input", value: string) => void;
  removeCondition: () => void;
}) => {
  return (
    <div className="flex flex-col p-3 gap-3 bg-background border rounded-lg">
      <div className="flex items-center gap-3 ">
        <div className="flex flex-1 flex-col gap-3">
          <VariableSelect
            list={variableList}
            value={variable}
            onValueChange={(value) => onChange("variable", value)}
          />
          <div className="flex items-center gap-3">
            <ConditionSelect
              value={operator}
              onValueChange={(value) => onChange("operator", value)}
            />
            <Input
              value={input}
              onChange={(e) => onChange("input", e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <Trash2
          size={16}
          className="cursor-pointer"
          onClick={removeCondition}
        />
      </div>
    </div>
  );
};

export const SavedConditionRow = ({
  variable,
  operator,
  input,
}: ConditionRowProps) => {
  const { icon, label } = getConditionVariable(variable!);
  return (
    <div className="flex flex-wrap items-center gap-3 bg-background">
      <div className="flex items-center gap-1 h-7 pl-1 pr-2 border rounded-lg bg-neutral-800">
        {icon}
        <code className="text-xs">{label}</code>
      </div>
      <p className="text-sm lowercase">{operator}</p>
      <code className="flex items-center justify-center text-xs h-7 px-2 border rounded-lg bg-neutral-800">
        {input}
      </code>
    </div>
  );
};

export const ConditionRowConnector = ({
  connector,
  onChange,
}: {
  connector: LogicalConnectionOperator;
  onChange: (value: string) => void;
}) => {
  const items = Object.values(LogicalConnectionOperator).map((value) => ({
    value,
  }));

  return (
    <div className="flex flex-col">
      <Line />
      <SimpleSelect
        className="w-[62px] ml-5 text-xs px-2 h-8 bg-neutral-900"
        value={connector}
        items={items}
        onValueChange={onChange}
      />
      <Line />
    </div>
  );
};

const Line = () => <div className="border-l h-6 ml-[51px]" />;

export const AddConditionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className="w-fit gap-1.5"
      onClick={onClick}
    >
      <CirclePlus size={16} />
      Add condition
    </Button>
  );
};

const VariableSelect = ({
  list,
  value,
  onValueChange,
}: SimpleSelectProps & {
  list: VariableType[];
}) => {
  const items = list.map(getConditionVariable);
  return (
    <SimpleSelect value={value} items={items} onValueChange={onValueChange} />
  );
};

const ConditionSelect = ({ value, onValueChange }: SimpleSelectProps) => {
  const items = Object.values(LogicalComparisionOperator).map((value) => ({
    value,
  }));
  return (
    <SimpleSelect value={value} items={items} onValueChange={onValueChange} />
  );
};

const getConditionVariable = (type: VariableType) => {
  const variable = type.split(":");
  return {
    icon: (
      <WorkflowIconHelper
        type={variable[0] as ConnectorDataType}
        size="sm"
        bgColor="transparent"
      />
    ),
    label: variable[1],
    value: type,
  };
};
