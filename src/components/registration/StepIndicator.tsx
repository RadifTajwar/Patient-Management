import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative">
      <div className="hidden md:block">
        <ol className="grid grid-cols-5 text-sm font-medium">
          {steps.map((step, index) => (
            <li
              key={step.name}
              className={cn(
                index <= currentStep ? "text-primary" : "text-muted-foreground",
                "relative"
              )}
            >
              <div className="absolute left-0 -bottom-[1.75rem] w-full">
                <div
                  className={cn(
                    "h-0.5 w-full",
                    index <= currentStep ? "bg-primary" : "bg-muted",
                    index === 0 ? "ml-2" : "",
                    index === steps.length - 1 ? "mr-2" : ""
                  )}
                ></div>
              </div>
              <div className="flex flex-col items-center group">
                <span
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-full border-2",
                    index <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
                <span className="mt-2 text-center">{step.name}</span>
                <span className="hidden text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="md:hidden">
        <ol className="flex items-center w-full space-x-2 p-2">
          {steps.map((step, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center space-x-2.5 flex-1",
                index === steps.length - 1
                  ? ""
                  : "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-muted after:border-4 after:inline-block"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-center font-medium mt-2">
          {steps[currentStep].name}
        </p>
        <p className="text-center text-sm text-muted-foreground mt-1">
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
