import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NotionDatabaseProperty,
  NotionDatabasePropertyType,
} from "@/model/notion-schemas";
import { Plus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const PropertiesTable = ({
  properties,
  isEdit,
  setProperties,
}: {
  properties: NotionDatabaseProperty[];
  isEdit?: boolean;
  setProperties?: Dispatch<SetStateAction<NotionDatabaseProperty[]>>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {isEdit ? (
        <Label htmlFor="properties">Properties</Label>
      ) : (
        <p className="font-semibold mt-4 mb-1">Properties</p>
      )}
      <div className="w-full rounded-md border">
        <Table id="properties">
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Column Type</TableHead>
              {isEdit ?? <TableHead></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEdit ? (
              <EditRows
                properties={properties}
                setProperties={setProperties!}
              />
            ) : (
              <>
                {properties.map(({ name, type }, index) => (
                  <TableRow className="font-mono text-sm" key={index}>
                    <TableCell className="p-4">
                      <p>{name}</p>
                    </TableCell>
                    <TableCell className="p-4">
                      <p>{type}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PropertiesTable;

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
          index={0}
          value={properties[0].name}
          setProperties={setProperties}
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
            index={index + 1}
            value={name}
            setProperties={setProperties}
          />
          <PropertyOptionsCell
            index={index + 1}
            value={type}
            setProperties={setProperties}
          />
          <TableCell>
            <Button
              variant="ghost"
              className="p-0 pr-2 hover:bg-transparent text-neutral-500 hover:text-neutral-400"
              onClick={() => {
                setProperties((prev) => {
                  prev.splice(index + 1, 1);
                  return [...prev];
                });
              }}
            >
              <Trash2 size={16} />
            </Button>
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell className="hover:bg-muted/50" colSpan={3}>
          <button
            className="w-full flex items-center justify-center gap-1 text-neutral-500 hover:text-neutral-400"
            onClick={() => {
              setProperties((prev) => [
                ...prev,
                {
                  name: "",
                  type: NotionDatabasePropertyType.RichText,
                },
              ]);
            }}
          >
            <Plus size={16} />
            <span>New</span>
          </button>
        </TableCell>
      </TableRow>
    </>
  );
};

const InputCell = ({
  value,
  index,
  setProperties,
}: {
  value: string;
  index: number;
  setProperties?: Dispatch<SetStateAction<NotionDatabaseProperty[]>>;
}) => {
  return (
    <TableCell>
      <Input
        placeholder="Name"
        value={value}
        onChange={(e) => {
          setProperties &&
            setProperties((prev) => {
              prev[index].name = e.target.value;
              return [...prev];
            });
        }}
      />
    </TableCell>
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
