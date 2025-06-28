import Sidebar from "@/components/sidebar";
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
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex overflow-hidden h-screen">
        <Sidebar />
        <div className="w-full">
          <div className="border-l-[1px] border-t-[1px] pb-20 h-screen rounded-l-3xl border-muted-foreground/20 overflow-scroll">
            {children}
          </div>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
