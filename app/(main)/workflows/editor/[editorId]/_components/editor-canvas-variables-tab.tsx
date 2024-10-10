import EditableTable, {
  DeleteButtonCell,
  InputCell,
} from "@/components/ui/editable-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Variable } from "@/components/variables";
import { WorkflowVariable } from "@/model/types";
import { useEditorStore } from "@/stores/editor-store";
import { useNodeModalStore } from "@/stores/node-modal-store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface EditorCanvasVariablesTabProps {}

const EditorCanvasVariablesTab = ({}: EditorCanvasVariablesTabProps) => {
  const { variables, updateVariables, selectNode } = useEditorStore();
  const { setOpen } = useNodeModalStore();

  const [vars, setVars] = useState<WorkflowVariable[]>(
    Object.values(variables)
  );
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setVars(Object.values(variables));
  }, [variables]);

  const handleSave = async () => {
    updateVariables(vars);
    setEdit(false);
  };

  return (
    <div className="flex flex-col gap-6 -mt-3">
      <div className="flex flex-col gap-2 text-sm">
        <p className="text-neutral-300">
          To use variables, wrap variable names in <code>{`{{}}`}</code>
        </p>
        <p className="text-xs text-neutral-500">
          For example, <code>{`{{username}}`}</code> will be replaced with the
          actual value during the workflow execution.
        </p>
      </div>
      <EditableTable
        withActionIcons
        headers={["Name", "Value"]}
        values={vars}
        isEdit={edit}
        editComponent={<EditRows variables={vars} setVariables={setVars} />}
        savedComponent={
          <SavedRows
            variables={vars}
            onVariableClick={(nodeId) => {
              selectNode(nodeId);
              setOpen(true);
            }}
          />
        }
        onAddClick={() => {
          setVars((prev) => [
            ...prev,
            {
              name: "",
              value: "",
            },
          ]);
        }}
        onEditClick={() => setEdit(true)}
        onSaveClick={handleSave}
      />
    </div>
  );
};

export default EditorCanvasVariablesTab;

const SavedRows = ({
  variables,
  onVariableClick,
}: {
  variables: WorkflowVariable[];
  onVariableClick: (nodeId: string) => void;
}) => {
  return (
    <>
      {variables.map(({ name, value, nodeId }, index) => (
        <TableRow key={index}>
          <TableCell className="p-4">{name}</TableCell>
          <TableCell className="p-4" colSpan={2}>
            {nodeId ? (
              <SimpleTooltip
                side="right"
                triggerComp={
                  <Variable
                    value={value}
                    className="cursor-pointer"
                    onClick={onVariableClick.bind(this, nodeId)}
                  />
                }
                contentComp={
                  <p className="text-xs">
                    <b>Node ID:</b> {nodeId}
                  </p>
                }
              />
            ) : (
              value
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const EditRows = ({
  variables,
  setVariables,
}: {
  variables: WorkflowVariable[];
  setVariables: Dispatch<SetStateAction<WorkflowVariable[]>>;
}) => {
  return (
    <>
      {variables.map(({ name, value }, index) => (
        <TableRow key={index}>
          <InputCell
            value={name}
            onChange={(value) => {
              setVariables((prev) => {
                prev[index].name = value;
                return [...prev];
              });
            }}
          />
          <InputCell
            value={value}
            onChange={(value) => {
              setVariables((prev) => {
                prev[index].value = value;
                return [...prev];
              });
            }}
          />
          <DeleteButtonCell
            onClick={() => {
              setVariables((prev) => {
                prev.splice(index, 1);
                return [...prev];
              });
            }}
          />
        </TableRow>
      ))}
    </>
  );
};
