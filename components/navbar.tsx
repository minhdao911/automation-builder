"use client";

import Image from "next/image";
import { FunctionComponent } from "react";

interface NavBarProps {}

const NavBar: FunctionComponent<NavBarProps> = () => {
  return (
    <header className="fixed top-0 right-0 p-4 px-8 w-full flex items-center justify-between bg-black/40 backdrop-blur-lg z-[100] border-b-[1px] border-neutral-900">
      <aside className="flex items-center">
        <p className="text-2xl font-semibold">AutoMate</p>
        <Image src="/logo.svg" alt="AutoMateX logo" width={20} height={20} />
      </aside>
      <aside>
        <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Dashboard
          </span>
        </button>
      </aside>
    </header>
  );
};

export default NavBar;
