"use client";

import { toast } from "@/components/ui/use-toast";
import { FunctionComponent } from "react";

interface EditorContainerProps {
  errorMessage?: string;
  children: React.ReactNode | React.ReactNode[];
}

const EditorContainer: FunctionComponent<EditorContainerProps> = ({
  errorMessage,
  children,
}) => {
  if (errorMessage) {
    toast({
      description: errorMessage,
      variant: "destructive",
    });
  }

  return <div className="w-full h-full">{children}</div>;
};

export default EditorContainer;
