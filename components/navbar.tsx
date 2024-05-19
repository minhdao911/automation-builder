"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <div className="flex flex-row justify-end gap-6 items-center px-4 py-4 w-full dark:bg-black ">
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
  );
};

export default NavBar;
