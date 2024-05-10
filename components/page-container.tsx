"use client";

import { FunctionComponent } from "react";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: FunctionComponent<PageContainerProps> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b justify-between">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default PageContainer;
