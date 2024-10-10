import { forwardRef, useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { VariableOptions, VariablesButton } from "../variables";

const TimePickerInput = forwardRef(
  (
    {
      value,
      disabled,
      className,
      hasVariable = false,
      onChange,
    }: {
      value: string;
      disabled?: boolean;
      className?: string;
      hasVariable?: boolean;
      onChange: (value: string) => void;
    },
    ref: any
  ) => {
    const [useVariable, setUseVariable] = useState(hasVariable);

    return (
      <div className="relative">
        {useVariable ? (
          <div className="w-[100px] mb-1">
            <VariableOptions
              className={className}
              value={value}
              disabled={disabled}
              onChange={onChange}
            />
          </div>
        ) : (
          <Input
            ref={ref}
            type="time"
            className={cn("w-fit mb-1", className)}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
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
  }
);
TimePickerInput.displayName = "TimePickerInput";

export default TimePickerInput;
