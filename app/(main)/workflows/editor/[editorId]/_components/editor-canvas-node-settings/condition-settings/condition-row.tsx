import {
  LogicalComparisionOperator,
  LogicalConnectionOperator,
  VariableType,
  WorkflowVariable,
} from "@/model/types";
import { CirclePlus, Trash2 } from "lucide-react";
import { SimpleSelectProps, SimpleSelect } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ConnectorDataType } from "@prisma/client";
import WorkflowIconHelper from "@/components/workflow-icon-helper";
import { Button } from "@/components/ui/button";

interface ConditionRowProps {
  variable?: VariableType;
  operator: LogicalComparisionOperator;
  input: string;
  wfVariables: WorkflowVariable[];
}

export const ConditionRow = ({
  ruleId,
  nodeId,
  variable,
  operator,
  input,
  wfVariables,
  variableList,
  onChange,
  removeCondition,
  setWfVariables,
}: ConditionRowProps & {
  ruleId: string;
  nodeId: string;
  variableList: VariableType[];
  onChange: (type: "variable" | "operator" | "input", value: string) => void;
  removeCondition: () => void;
  setWfVariables: (vars: WorkflowVariable[]) => void;
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
        <DeleteButton onClick={removeCondition} />
      </div>
      {operator === LogicalComparisionOperator.MatchPattern && (
        <div>
          <AddButton
            label="Add variable"
            onClick={() => {
              setWfVariables([
                ...wfVariables,
                { name: "", value: "", ruleId, nodeId },
              ]);
            }}
          />
          {wfVariables
            .filter((v) => !v.removed)
            .map(({ name, value }, index) => (
              <WorkflowVariableRow
                key={index}
                name={name}
                value={value ?? ""}
                onChange={(type, value) => {
                  const newVars = [...wfVariables];
                  newVars[index][type] = value;
                  setWfVariables(newVars);
                }}
                onDelete={() => {
                  const newVars = [...wfVariables];
                  newVars[index].removed = true;
                  setWfVariables(newVars);
                }}
              />
            ))}
        </div>
      )}
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
      <div className="flex items-center gap-1 h-7 pl-1 pr-2 border rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {icon}
        <code className="text-xs">{label}</code>
      </div>
      <p className="text-sm lowercase">{operator}</p>
      <code className="flex items-center justify-center text-xs h-7 px-2 border rounded-lg bg-neutral-100 dark:bg-neutral-800">
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
        className="w-[62px] ml-5 text-xs px-2 h-8 bg-neutral-100 dark:bg-neutral-900"
        value={connector}
        items={items}
        onValueChange={onChange}
      />
      <Line />
    </div>
  );
};

const Line = () => <div className="border-l h-6 ml-[51px]" />;

export const AddButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className="w-fit gap-1.5"
      onClick={onClick}
    >
      <CirclePlus size={16} />
      {label}
    </Button>
  );
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="ghost"
      className="p-0 hover:bg-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
      onClick={onClick}
    >
      <Trash2 size={16} />
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

const WorkflowVariableRow = ({
  name,
  value,
  onChange,
  onDelete,
}: {
  name: string;
  value: string;
  onChange: (type: "name" | "value", value: string) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 mt-3">
      <Input
        value={name}
        placeholder="Variable name"
        onChange={(e) => onChange("name", e.target.value)}
      />
      <Input
        value={value}
        placeholder="Value"
        onChange={(e) => onChange("value", e.target.value)}
      />
      <DeleteButton onClick={onDelete} />
    </div>
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
