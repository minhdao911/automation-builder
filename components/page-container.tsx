"use client";

import { FunctionComponent } from "react";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  headerButton?: React.ReactNode;
}

const PageContainer: FunctionComponent<PageContainerProps> = ({
  title,
  children,
  headerButton,
}) => {
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
