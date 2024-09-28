import { forwardRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  className?: string;
  onChange: (value: any) => void;
}

const DatePicker = forwardRef(
  ({ value, className, onChange }: DatePickerProps, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-between text-left font-normal",
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
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = "DatePicker";

export default DatePicker;
