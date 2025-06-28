import ResponsiveWrapper from "@/components/responsive-wrapper";
import Sidebar from "@/components/sidebar";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }: LayoutProps) => {
  return (
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
  );
};

export default Layout;
