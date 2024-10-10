import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Label } from "./label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { Button } from "./button";

interface EditableTableProps {
  headers: string[];
  values: any[];
  isEdit: boolean;
  label?: string;
  withActionIcons?: boolean;
  editComponent?: React.ReactNode;
  savedComponent?: React.ReactNode;
  onAddClick: () => void;
  onSaveClick?: () => void;
  onEditClick?: () => void;
}

const EditableTable = ({
  headers,
  values,
  isEdit,
  label,
  withActionIcons,
  editComponent,
  savedComponent,
  onAddClick,
  onSaveClick,
  onEditClick,
}: EditableTableProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label &&
        (isEdit ? (
          <Label htmlFor={label}>{label}</Label>
        ) : (
          <p className="font-semibold mt-4 mb-1">{label}</p>
        ))}
      <div className="w-full rounded-md border">
        <Table id={label}>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              {isEdit ? (
                <>
                  {withActionIcons ? (
                    <TableHead className="w-[50px]">
                      <Save
                        className="cursor-pointer text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                        size={16}
                        onClick={onSaveClick}
                      />
                    </TableHead>
                  ) : (
                    <TableHead />
                  )}
                </>
              ) : (
                withActionIcons && (
                  <TableHead className="w-[50px]">
                    <Pencil
                      className="cursor-pointer text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                      size={16}
                      onClick={onEditClick}
                    />
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEdit ? (
              <>
                {editComponent}
                <TableRow>
                  <TableCell
                    className="hover:bg-muted/50"
                    colSpan={headers.length + 1}
                  >
                    <button
                      className="w-full flex items-center justify-center gap-1 text-neutral-500 hover:text-neutral-400"
                      onClick={onAddClick}
                    >
                      <Plus size={16} />
                      <span>New</span>
                    </button>
                  </TableCell>
                </TableRow>
              </>
            ) : values.length > 0 ? (
              savedComponent
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length + (withActionIcons ? 1 : 0)}
                  className="text-center p-4 text-neutral-400 dark:text-neutral-600"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EditableTable;

export const InputCell = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <TableCell>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </TableCell>
  );
};

export const DeleteButtonCell = ({ onClick }: { onClick: () => void }) => {
  return (
    <TableCell>
      <Button
        variant="ghost"
        className="w-full p-0 hover:bg-transparent text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        onClick={onClick}
      >
        <Trash2 size={16} />
      </Button>
    </TableCell>
  );
};
