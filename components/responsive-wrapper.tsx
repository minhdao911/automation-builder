"use client";

import useWindowDimensions from "@/hooks/use-window-dimensions";

const ResponsiveWrapper = ({ children }: { children: React.ReactNode }) => {
  const { width } = useWindowDimensions();
  const isMobile = width && width < 1024;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="font-bold">Mobile not supported</p>
        <p className="text-sm text-muted-foreground">
          Please use a desktop browser to access the app
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ResponsiveWrapper;
