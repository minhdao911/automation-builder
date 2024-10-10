import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { VariableOptions, VariablesButton } from "../variables";

interface DatePickerProps {
  value?: string;
  hasVariable?: boolean;
  className?: string;
  onChange: (value: any) => void;
}

const DatePicker = ({
  value,
  hasVariable = false,
  className,
  onChange,
}: DatePickerProps) => {
  const [useVariable, setUseVariable] = useState(hasVariable);

  return (
    <div className="relative">
      {useVariable ? (
        <div className="w-full mb-1">
          <VariableOptions
            className={className}
            value={value as string}
            onChange={onChange}
          />
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full mb-1 justify-between text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              {value ? (
                dayjs(value).format("MMMM DD, YYYY")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-4 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
      <VariablesButton
        isVariableUsed={useVariable}
        onClick={() => {
          setUseVariable(!useVariable);
          onChange("");
        }}
      />
    </div>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;
