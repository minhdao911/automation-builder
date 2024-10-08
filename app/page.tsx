import { BackgroundBeams } from "@/components/background-beams";
import { InfiniteMovingCards } from "@/components/infinite-moving-cards";
import { LampComponent } from "@/components/lamp";
import LandingNavBar from "@/components/landing-navbar";
import { StickyScroll } from "@/components/sticky-scroll-reveal";
import { Button } from "@/components/ui/button";
import { INTEGRATIONS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const keyFeatures = [
  {
    title: "Create Custom Automation Workflows",
    description:
      "Tailor automation workflows to fit your specific needs and requirements.",
  },
  {
    title: "Seamless Integration with Your Favorite Apps",
    description:
      "Connect with popular apps and platforms to extend the capabilities of your automations, ensuring efficient workflow across all your applications.",
  },
  {
    title: "Effortlessly Automate Repetitive Tasks",
    description:
      "Say goodbye to manual repetition! Let the app handle the repetitive work for you, so you can focus on more important tasks and projects.",
  },
  {
    title: "Personalize Workflows to Match Your Needs",
    description:
      "Customize automation workflows to match your unique requirements and preferences.",
  },
];

export default function Home() {
  return (
    <main>
      <LandingNavBar />
      <section className="relative h-[800px] md:h-screen w-full bg-neutral-950">
        <div className="absolute inset-0 h-full w-full flex flex-col items-center justify-end gap-10 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-4xl text-center font-semibold text-black dark:text-white">
              Unleash the power of automation with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                AutoMateX
              </span>
            </h1>
            <Button className="p-4 md:p-6 text-lg md:text-xl w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all hover:shadow-xl hover:shadow-neutral-500 duration-500">
              <Link
                className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-300  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black"
                href="/workflows"
              >
                Get Started
              </Link>
            </Button>
          </div>
          <div className="h-[65%] mx-auto rounded-t-2xl bg-background p-5 pb-0">
            <Image
              src="/banner.png"
              alt="Banner"
              height={400}
              width={1400}
              className="h-full rounded-t-xl object-cover object-left-top"
              draggable={false}
            />
          </div>
        </div>
      </section>
      <InfiniteMovingCards
        className="mt-5"
        items={INTEGRATIONS}
        direction="right"
        speed="slow"
      />
      <section className="w-full mt-5 relative">
        <StickyScroll content={keyFeatures} />
        <BackgroundBeams />
      </section>
      <section className="mt-[-80px]">
        <LampComponent />
      </section>
    </main>
  );
}
