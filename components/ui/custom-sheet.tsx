"use client";

import { cn } from "@/lib/utils";
import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

interface CustomSheetProps {
  open: boolean;
  className?: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const CustomSheet: FunctionComponent<CustomSheetProps> = ({
  open,
  className,
  children,
  onClose,
}) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!open) {
      timeout = setTimeout(() => {
        setHidden(true);
      }, 250);
    } else {
      setHidden(false);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [open]);

  if (hidden) return null;

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        `fixed w-[450px] h-full z-50 gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right`,
        className
      )}
    >
      <CustomSheetClose onClick={onClose} />
      {children}
    </div>
  );
};

export default CustomSheet;

interface CustomSheetCloseProps {
  className?: string;
  onClick: () => void;
}

const CustomSheetClose = ({ className, onClick }: CustomSheetCloseProps) => {
  return (
    <Button
      className={cn("absolute top-4 right-4 w-fit h-fit p-1", className)}
      variant="ghost"
      size="icon"
      onClick={onClick}
    >
      <X size={24} />
    </Button>
  );
};

interface CustomSheetTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomSheetTitle = ({
  className,
  children,
}: CustomSheetTitleProps) => {
  return (
    <p className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </p>
  );
};

interface CustomSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CustomSheetDescription = ({
  children,
  className,
  onClick,
}: CustomSheetDescriptionProps) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

interface CustomSheetSectionTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export const CustomSheetSectionTitle = ({
  className,
  children,
}: CustomSheetSectionTitleProps) => {
  return (
    <p className={cn("font-semibold text-foreground", className)}>{children}</p>
  );
};
