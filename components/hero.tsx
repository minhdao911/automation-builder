import React from "react";
import { BackgroundBeams } from "./background-beams";
import { PointerHighlight } from "./pointer-highlight";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="w-full h-screen bg-neutral-950 pt-[73px] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center z-10">
        <div className="flex gap-2 md:gap-5 mb-6">
          <GlowBadge>Workflow</GlowBadge>
          <GlowBadge>Automation</GlowBadge>
          <GlowBadge>Efficient</GlowBadge>
        </div>
        <div className="mx-auto px-0 md:px-10 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white flex flex-col items-center">
          <div className="flex gap-2">
            <PointerHighlight>
              <span>Automate</span>
            </PointerHighlight>
            <p className="hidden md:block">your tedious tasks</p>
          </div>
          <p className="block md:hidden mt-4">your tedious tasks</p>
          <p className="mt-0 md:mt-4">with couple of clicks</p>
        </div>
        <Button className="mt-10 p-4 md:p-6 md:text-base w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all hover:shadow-xl hover:shadow-neutral-500 duration-500">
          <Link
            className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-300 md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black"
            href="/workflows"
          >
            Start Now - It&apos;s Free
          </Link>
        </Button>
      </div>
      <BackgroundBeams />
    </section>
  );
};

export default Hero;

const GlowBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <Badge className="border border-gray-700 shadow-[0px_0px_5px_0px_#2D2D2D] text-neutral-400 text-[10px] md:text-xs">
      {children}
    </Badge>
  );
};
