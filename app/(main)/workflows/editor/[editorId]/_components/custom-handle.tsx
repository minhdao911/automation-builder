import { CSSProperties, FunctionComponent } from "react";
import { Handle, HandleProps, Position } from "reactflow";

type CustomHandleProps = HandleProps & { style?: CSSProperties };

const CustomHandle: FunctionComponent<CustomHandleProps> = (props) => {
  return (
    <Handle
      {...props}
      className={`${
        props.position === Position.Bottom ? "!-bottom-2" : "!-top-2"
      } !h-4 !w-4 !bg-neutral-200 !border-neutral-400 dark:!bg-neutral-800`}
    />
  );
};

export default CustomHandle;
