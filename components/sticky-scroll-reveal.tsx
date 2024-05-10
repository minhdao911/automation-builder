"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);

  const ref = useRef<any>(null);

  const cardLength = content.length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const val = activeCard === cardLength - 1 ? 0 : activeCard + 1;
      setActiveCard(val);
    }, 2000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard]);

  return (
    <motion.div
      className="flex justify-center relative space-x-10 rounded-md p-10 py-0 md:py-10  gap-[50px] xl:gap-[150px] items-center"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg text-slate-300 max-w-md mt-5"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div className="hidden lg:block">
        <Image
          src="/integrations.svg"
          alt="Integrations"
          width={450}
          height={450}
          className="mt-[-10rem]"
        />
      </div>
    </motion.div>
  );
};
