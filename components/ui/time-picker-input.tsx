import { forwardRef } from "react";
import { Input, InputProps } from "./input";
import { cn } from "@/lib/utils";

const TimePickerInput = forwardRef(
  ({ className, ...props }: InputProps, ref: any) => {
    return (
      <Input
        ref={ref}
        type="time"
        className={cn("w-fit", className)}
        {...props}
      />
    );
  }
);
TimePickerInput.displayName = "TimePickerInput";

export default TimePickerInput;
