import EditableTable, {
  DeleteButtonCell,
  InputCell,
} from "@/components/ui/editable-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { WorkflowVariable } from "@/model/types";
import { useEditorStore } from "@/stores/editor-store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface EditorCanvasVariablesTabProps {}

const EditorCanvasVariablesTab = ({}: EditorCanvasVariablesTabProps) => {
  const { variables, updateVariables } = useEditorStore();

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
    <div className="flex flex-col gap-3 items-end">
      <EditableTable
        withActionIcons
        headers={["Name", "Value"]}
        values={vars}
        isEdit={edit}
        editComponent={<EditRows variables={vars} setVariables={setVars} />}
        savedComponent={<SavedRows variables={vars} />}
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

const SavedRows = ({ variables }: { variables: WorkflowVariable[] }) => {
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
                  <div className="text-xs p-0.5 border w-fit rounded-md text-blue-500 bg-neutral-900">
                    {value}
                  </div>
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
