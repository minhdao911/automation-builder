import ResponsiveWrapper from "@/components/responsive-wrapper";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ResponsiveWrapper>
        <div className="flex overflow-hidden h-screen bg-neutral-50 dark:bg-neutral-950">
          <Sidebar />
          <div className="w-full">
            <div className="border-l-[1px] border-t-[1px] h-screen rounded-l-3xl border-muted-foreground/20 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </ResponsiveWrapper>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;
