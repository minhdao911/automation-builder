import Sidebar from "@/components/sidebar";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        <div className="border-l-[1px] border-t-[1px] pb-20 h-screen rounded-l-3xl border-muted-foreground/20 overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
