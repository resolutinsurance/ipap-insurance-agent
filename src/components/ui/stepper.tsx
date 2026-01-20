import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "vertical" | "horizontal";
  showDescription?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  className,
  orientation = "vertical",
  showDescription = true,
}: StepperProps) {
  if (orientation === "horizontal") {
    return (
      <ol className={cn("flex items-center w-full", className)}>
        {steps.map((step, index) => (
          <li key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center flex-1">
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mb-2",
                  currentStep >= index + 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {currentStep > index + 1 ? <CheckIcon /> : <span>{index + 1}</span>}
              </span>
              <h3
                className={cn(
                  "text-sm font-medium text-center whitespace-nowrap",
                  currentStep >= index + 1 ? "text-primary" : "text-gray-500"
                )}
              >
                {step.title}
              </h3>
              {showDescription && (
                <p className="text-xs text-gray-500 text-center mt-1">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 -mt-4",
                  currentStep > index + 1 ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    );
  }

  // Vertical stepper (original)
  return (
    <ol className={cn("relative text-gray-500 border-s border-gray-200", className)}>
      {steps.map((step, index) => (
        <li
          key={index}
          className={cn("mb-10 ms-6", currentStep >= index + 1 ? "text-primary" : "")}
        >
          <span
            className={cn(
              "absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white",
              currentStep >= index + 1
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {currentStep > index + 1 ? <CheckIcon /> : <span>{index + 1}</span>}
          </span>
          <h3 className="font-medium leading-tight">{step.title}</h3>
          {showDescription && <p className="text-sm">{step.description}</p>}
        </li>
      ))}
    </ol>
  );
}
