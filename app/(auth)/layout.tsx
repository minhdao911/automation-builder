import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <div className="h-screen w-full flex items-center justify-center">
        {children}
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
