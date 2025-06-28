import Drive from "./icons/drive";
import Gmail from "./icons/gmail";
import Notion from "./icons/notion";
import Slack from "@/components/icons/slack";
import Calendar from "@/components/icons/calendar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

const IntegrationList = () => {
  return (
    <section className="mt-20 py-20 bg-neutral-950">
      <div className="container mx-auto flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Manage and integrate your tools in one place
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
            Don&apos;t spend time on manual work. Let us do it for you.
          </p>
        </div>

        {/* Integration Icons Grid */}
        <div className="grid grid-cols-3 md:flex md:flex-wrap md:items-center justify-center gap-8 md:gap-12 max-w-4xl mx-auto">
          <IntegrationItem icon={<Drive size={48} />} name="Google Drive" />
          <IntegrationItem icon={<Gmail size={48} />} name="Gmail" />
          <IntegrationItem
            icon={<Calendar size={48} />}
            name="Google Calendar"
          />
          <IntegrationItem icon={<Notion size={48} />} name="Notion" />
          <IntegrationItem icon={<Slack size={48} />} name="Slack" />
          <IntegrationItem
            icon={<Ellipsis size={48} color="white" />}
            name="And more..."
            className="flex md:hidden"
          />
        </div>

        {/* Connection Lines Effect */}
        <div className="mt-12 relative w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full"></div>
            <div className="mx-4 p-3 rounded-full bg-neutral-800 border border-neutral-700">
              <Image
                src="/logo.svg"
                alt="Automation Builder"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationList;

const IntegrationItem = ({
  icon,
  name,
  className,
}: {
  icon: React.ReactNode;
  name: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-3 group", className)}>
      <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 group-hover:border-neutral-600 transition-all duration-300 group-hover:scale-105">
        {icon}
      </div>
      <span className="text-xs md:text-sm text-center text-gray-400 group-hover:text-gray-300 transition-colors">
        {name}
      </span>
    </div>
  );
};
