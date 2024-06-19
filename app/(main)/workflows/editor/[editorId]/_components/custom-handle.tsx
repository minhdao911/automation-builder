import { CSSProperties, FunctionComponent } from "react";
import { Handle, HandleProps } from "reactflow";

type CustomHandleProps = HandleProps & { style?: CSSProperties };

const CustomHandle: FunctionComponent<CustomHandleProps> = (props) => {
  return (
    <Handle {...props} className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800" />
  );
};

export default CustomHandle;
