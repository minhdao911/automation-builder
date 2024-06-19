"use client";

import Link from "next/link";
import { FunctionComponent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MENU_OPTIONS } from "@/lib/constants";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Logo from "./icons/logo";
import { ModeToggle } from "./mode-toggle";

interface SidebarProps {}

const Sidebar: FunctionComponent<SidebarProps> = () => {
  const pathName = usePathname();

  return (
    <nav className="dark:bg-black h-screen overflow-scroll justify-between flex items-center flex-col gap-10 py-6 px-4">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link className="flex font-bold flex-row mb-4 mt-2" href="/">
          <Logo />
        </Link>
        <TooltipProvider>
          {MENU_OPTIONS.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        "group h-8 w-8 flex items-center justify-center scale-[1.5] rounded-lg p-[3px] cursor-pointer",
                        {
                          "dark:bg-[#2F006B] bg-[#EEE0FF]":
                            pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                        selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Sidebar;
