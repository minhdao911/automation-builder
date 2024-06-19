import { cn } from "@/lib/utils";
import { FunctionComponent } from "react";

interface StatusDotProps {
  available?: boolean;
  className?: string;
}

const StatusDot: FunctionComponent<StatusDotProps> = ({
  available,
  className,
}) => {
  return (
    <span
      className={cn(
        `h-2 w-2 rounded-full ${available ? "bg-green-500" : "bg-orange-400"}`,
        className
      )}
    />
  );
};

export default StatusDot;
