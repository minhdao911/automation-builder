"use client";

import { FunctionComponent } from "react";
import { toast } from "./ui/use-toast";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  headerButton?: React.ReactNode;
  errorMessage?: string;
}

const PageContainer: FunctionComponent<PageContainerProps> = ({
  title,
  children,
  headerButton,
  errorMessage,
}) => {
  console.log(errorMessage);
  if (errorMessage) {
    toast({
      description: errorMessage,
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col relative">
      <header className="flex items-center justify-between sticky top-0 z-[10] p-6 pt-10 bg-background/50 backdrop-blur-lg border-b">
        <h1 className="text-4xl">{title}</h1>
        {headerButton}
      </header>
      {children}
    </div>
  );
};

export default PageContainer;
