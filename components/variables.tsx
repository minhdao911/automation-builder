import { useEditorStore } from "@/stores/editor-store";
import { SimpleSelect } from "./ui/select";
import { cn } from "@/lib/utils";

export const Variable = ({
  value,
  className,
  onClick,
}: {
  value: string;
  className?: string;
  onClick?: () => void;
}) => (
  <span
    className={cn(
      `text-xs p-0.5 border w-fit rounded-md text-blue-500 bg-neutral-900`,
      className
    )}
    onClick={onClick}
  >
    {value}
  </span>
);

export const VariablesButton = ({
  isVariableUsed,
  onClick,
}: {
  isVariableUsed: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className="absolute left-0 -bottom-4 text-xs text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
      onClick={onClick}
    >
      {isVariableUsed ? "Remove variable" : "Use variables"}
    </button>
  );
};

export const VariableOptions = ({
  value,
  disabled,
  className,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}) => {
  const { variables } = useEditorStore();
  const items = Object.values(variables).map(({ name }) => ({
    value: `{{${name}}}`,
  }));

  return (
    <SimpleSelect
      className={className}
      value={value}
      items={items}
      disabled={disabled}
      onValueChange={onChange}
    />
  );
};
