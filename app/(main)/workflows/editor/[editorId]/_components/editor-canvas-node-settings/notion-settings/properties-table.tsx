import EditableTable, {
  DeleteButtonCell,
  InputCell,
} from "@/components/ui/editable-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  NotionDatabaseProperty,
  NotionDatabasePropertyType,
} from "@/model/notion-schemas";
import { Dispatch, SetStateAction } from "react";

const PropertiesTable = ({
  properties,
  isEdit,
  setProperties,
}: {
  properties: NotionDatabaseProperty[];
  isEdit: boolean;
  setProperties?: Dispatch<SetStateAction<NotionDatabaseProperty[]>>;
}) => {
  return (
    <EditableTable
      values={properties}
      headers={["Column Name", "Column Type"]}
      label="Properties"
      isEdit={isEdit}
      onAddClick={() => {
        setProperties &&
          setProperties((prev) => [
            ...prev,
            {
              name: "",
              type: NotionDatabasePropertyType.RichText,
            },
          ]);
      }}
      editComponent={
        <EditRows properties={properties} setProperties={setProperties!} />
      }
      savedComponent={<SavedRows properties={properties} />}
    />
  );
};

export default PropertiesTable;

const SavedRows = ({
  properties,
}: {
  properties: NotionDatabaseProperty[];
}) => {
  return (
    <>
      {properties.map(({ name, type }, index) => (
        <TableRow className="font-mono text-sm" key={index}>
          <TableCell className="p-4">{name}</TableCell>
          <TableCell className="p-4">{type}</TableCell>
        </TableRow>
      ))}
    </>
  );
};

const EditRows = ({
  properties,
  setProperties,
}: {
  properties: NotionDatabaseProperty[];
  setProperties: Dispatch<SetStateAction<NotionDatabaseProperty[]>>;
}) => {
  return (
    <>
      <TableRow>
        <InputCell
          value={properties[0].name}
          onChange={(value) => {
            setProperties((prev) => {
              prev[0].name = value;
              return [...prev];
            });
          }}
        />
        <TableCell>
          <div className="h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm">
            Title
          </div>
        </TableCell>
      </TableRow>
      {properties.slice(1).map(({ name, type }, index) => (
        <TableRow key={index}>
          <InputCell
            value={name}
            onChange={(value) => {
              setProperties((prev) => {
                prev[index + 1].name = value;
                return [...prev];
              });
            }}
          />
          <PropertyOptionsCell
            index={index + 1}
            value={type}
            setProperties={setProperties}
          />
          <DeleteButtonCell
            onClick={() => {
              setProperties((prev) => {
                prev.splice(index + 1, 1);
                return [...prev];
              });
            }}
          />
        </TableRow>
      ))}
    </>
  );
};

const PropertyOptionsCell = ({
  value,
  index,
  setProperties,
}: {
  value: string;
  index: number;
  setProperties: Dispatch<SetStateAction<NotionDatabaseProperty[]>>;
}) => {
  return (
    <TableCell>
      <Select
        value={value}
        onValueChange={(value) => {
          setProperties((prev) => {
            prev[index].type = value as NotionDatabasePropertyType;
            return [...prev];
          });
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(NotionDatabasePropertyType).map((key, index) => (
            <SelectItem
              key={index}
              value={
                NotionDatabasePropertyType[
                  key as keyof typeof NotionDatabasePropertyType
                ]
              }
            >
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
};
