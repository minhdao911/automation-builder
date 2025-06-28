"use client";

import React, { useState } from "react";
import DemoCanvas from "./demo-canvas";
import { ChevronDown } from "lucide-react";

const keyFeatures = [
  {
    id: 1,
    number: "01",
    title: "Multi-step workflows",
    description:
      "Build automation chains that connect multiple apps and services. Our drag-and-drop interface makes it simple to create workflows that would typically require technical expertise.",
  },
  {
    id: 2,
    number: "02",
    title: "Conditional logic",
    description:
      "Set up decision points in your workflows. Use if-then logic, filters, and conditions to create dynamic automation that adapts to different scenarios automatically.",
  },
  {
    id: 3,
    number: "03",
    title: "Custom variables",
    description:
      "Create custom variables to store and reuse data across your workflows. No more manual data entry or repetitive tasks.",
  },
];

const FeatureList = () => {
  const [selectedFeature, setSelectedFeature] = useState(keyFeatures[0]);

  const handleFeatureClick = (index: number) => {
    setSelectedFeature(keyFeatures[index]);
  };

  return (
    <section className="py-20 px-5 md:px-10 max-w-[90rem] mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10 justify-between items-center lg:items-start">
          {/* Left side - Feature list */}
          <div className="max-w-[600px]">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 leading-tight">
              Start simple, scale to
              <br />
              sophistication
            </h2>
            <div className="space-y-1">
              {keyFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`group cursor-pointer select-none transition-all duration-300 rounded-lg p-4 overflow-hidden ${
                    selectedFeature.id === feature.id
                      ? "bg-neutral-800/50"
                      : "hover:bg-neutral-900/30"
                  }`}
                  onClick={() => handleFeatureClick(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs md:text-sm font-medium transition-colors duration-200 ${
                          selectedFeature.id === feature.id
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {feature.number}
                      </span>
                      <h3
                        className={`text-base md:text-lg font-medium transition-colors duration-200 ${
                          selectedFeature.id === feature.id
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`ml-8 transition-all duration-300 ease-in-out ${
                      selectedFeature.id === feature.id
                        ? "max-h-40 opacity-100 mt-3"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Preview mockups */}
          <div className="relative w-full max-w-[600px] bg-neutral-800/50 rounded-lg flex justify-center items-center border border-neutral-700/5">
            <DemoCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureList;
