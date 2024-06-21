"use client";

import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";

const NavBar = () => {
  const pathname = usePathname();
  const isEditor = pathname.includes("editor");

  const { setNodes, setEdges } = useEditorStore();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between dark:bg-black px-4 py-4 w-full">
      {isEditor && (
        <Button
          variant="ghost"
          size="sm"
          className="pl-1.5"
          onClick={() => {
            router.push("/workflows");
            setTimeout(() => {
              setNodes([]);
              setEdges([]);
            }, 1000);
          }}
        >
          <ChevronLeft size={24} />
          Back
        </Button>
      )}
      <div className="flex justify-end gap-6 items-center w-full">
        <span className="flex items-center gap-2 font-bold">
          <p className="text-sm font-light text-gray-300">Credits</p>
          <span>1/10</span>
        </span>
        <span className="flex items-center rounded-full bg-muted px-4">
          <Search />
          <Input
            placeholder="Quick Search"
            className="border-none bg-transparent"
          />
        </span>
        <UserButton />
      </div>
    </div>
  );
};

export default NavBar;
