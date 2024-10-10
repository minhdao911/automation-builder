import {
  Condition,
  LogicalComparisionOperator,
  LogicalConnectionOperator,
  VariableType,
  WorkflowNodeData,
  WorkflowVariable,
} from "@/model/types";
import { Edge, Node } from "reactflow";
import { SettingsSection } from "../common";
import { Button } from "@/components/ui/button";
import {
  ConditionRow,
  AddButton,
  ConditionRowConnector,
  SavedConditionRow,
} from "./condition-row";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { useEditorStore } from "@/stores/editor-store";
import { VARIABLE_TYPES } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface ConditionSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const ConditionSettings = ({ selectedNode }: ConditionSettingsProps) => {
  const {
    edges,
    triggerNode,
    variables: wfVars,
    updateNode,
    updateVariables,
  } = useEditorStore();
  const { metadata } = selectedNode.data;
  const savedData = metadata?.condition;

  const [condition, setCondition] = useState<Condition>(
    savedData ?? {
      connector: undefined,
      rules: [
        {
          id: uuidv4(),
          variable: undefined,
          operator: LogicalComparisionOperator.Equal,
          input: "",
        },
      ],
    }
  );
  const [edit, setEdit] = useState(false);
  const [variables, setVariables] = useState<VariableType[]>([]);
  const [wfVariables, setWfVariables] = useState<WorkflowVariable[]>(
    Object.values(wfVars).filter((v) => v.nodeId === selectedNode.id)
  );

  const showEdit = edit || !savedData;

  useEffect(() => {
    if (triggerNode) {
      const isConnectedToTriggerNode = checkIfConnectedToTriggerNode(
        selectedNode,
        triggerNode,
        edges
      );
      if (isConnectedToTriggerNode) {
        setVariables(VARIABLE_TYPES[triggerNode.data.dataType]);
      }
    }
  }, [triggerNode, edges]);

  const addCondition = () => {
    setCondition((prev) => {
      let newConnector = prev.connector;
      const newRules = cloneDeep(prev.rules);
      if (!prev.connector) {
        newConnector = LogicalConnectionOperator.And;
      }
      newRules.push({
        id: uuidv4(),
        variable: undefined,
        operator: LogicalComparisionOperator.Equal,
        input: "",
      });
      return {
        connector: newConnector,
        rules: newRules,
      };
    });
  };

  const removeCondition = (index: number) => {
    setCondition((prev) => {
      let newConnector = prev.connector;
      const newRules = cloneDeep(prev.rules);
      if (newRules.length === 2 && index === 1) {
        newConnector = undefined;
      }
      newRules.splice(index, 1);
      return {
        connector: newConnector,
        rules: newRules,
      };
    });
  };

  const handleConditionChange = (
    type: "variable" | "operator" | "input" | "connector",
    value: string,
    index: number
  ) => {
    setCondition((prev) => {
      let newConnector = prev.connector;
      const newRules = cloneDeep(prev.rules);
      switch (type) {
        case "variable": {
          newRules[index].variable = value as VariableType;
          break;
        }
        case "operator": {
          newRules[index].operator = value as LogicalComparisionOperator;
          break;
        }
        case "input": {
          newRules[index].input = value;
          break;
        }
        case "connector": {
          newConnector = value as LogicalConnectionOperator;
          break;
        }
        default:
          break;
      }
      return {
        connector: newConnector,
        rules: newRules,
      };
    });
  };

  const handleSave = () => {
    if (!validateData()) {
      toast({
        description: "Invalid condition",
        variant: "destructive",
      });
      return;
    }
    updateNode(selectedNode.id, {
      metadata: {
        ...metadata,
        condition,
      },
    });
    updateVariables(wfVariables);
    setEdit(false);
  };

  const validateData = () => {
    if (!condition.rules.length) {
      return false;
    }
    return condition.rules.every(
      (rule) =>
        rule.variable &&
        rule.operator &&
        rule.input &&
        rule.input.trim().length > 0
    );
  };

  return (
    <>
      <SettingsSection
        title="Condition settings"
        editable={!showEdit}
        onEditClick={setEdit}
      >
        {showEdit ? (
          <div className="grid gap-4">
            <div className="swapy-container">
              {condition.rules.map(({ variable, operator, input }, index) => (
                <>
                  <ConditionRow
                    nodeId={selectedNode.id}
                    variable={variable}
                    operator={operator}
                    input={input}
                    variableList={variables}
                    wfVariables={wfVariables}
                    onChange={(type, value) =>
                      handleConditionChange(type, value, index)
                    }
                    removeCondition={() => removeCondition(index)}
                    setWfVariables={setWfVariables}
                  />
                  {condition.connector &&
                    index !== condition.rules.length - 1 && (
                      <ConditionRowConnector
                        connector={condition.connector}
                        onChange={(value) =>
                          handleConditionChange("connector", value, index)
                        }
                      />
                    )}
                </>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <AddButton label="Add condition" onClick={addCondition} />
              <Button size="sm" type="submit" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {savedData!.rules.map(({ variable, operator, input }, index) => (
              <>
                <SavedConditionRow
                  key={index}
                  variable={variable}
                  operator={operator}
                  input={input}
                  wfVariables={wfVariables}
                />
                {savedData.connector &&
                  index !== savedData.rules.length - 1 && (
                    <p className="ml-5 my-3 text-sm uppercase">
                      {savedData.connector}
                    </p>
                  )}
              </>
            ))}
          </div>
        )}
      </SettingsSection>
    </>
  );
};

export default ConditionSettings;

const checkIfConnectedToTriggerNode = (
  selectedNode: Node<WorkflowNodeData>,
  triggerNode: Node<WorkflowNodeData>,
  edges: Edge[]
) => {
  let source = edges.find((e) => e.target === selectedNode.id)?.source;
  while (source) {
    if (source === triggerNode.id) {
      return true;
    }
    source = edges.find((e) => e.target === source)?.source;
  }
  return false;
};
