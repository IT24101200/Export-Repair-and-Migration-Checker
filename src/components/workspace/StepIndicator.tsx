import { WorkspaceStep } from "@/lib/types/workspace";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: WorkspaceStep;
  onStepClick?: (step: WorkspaceStep) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const steps: { id: WorkspaceStep; label: string; number: number }[] = [
    { id: "choose", label: "Choose File", number: 1 },
    { id: "scanning", label: "Scan", number: 2 },
    { id: "review", label: "Review Issues", number: 3 },
    { id: "building", label: "Build Copy", number: 4 },
    { id: "download", label: "Download", number: 5 },
  ];

  const getStepIndex = (step: WorkspaceStep) => steps.findIndex((s) => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isClickable = idx < currentIndex && onStepClick;

          return (
            <li key={step.id} className="flex-1 flex items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-2 group w-full text-left focus:outline-none ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-teal-600 text-white"
                      : isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-semibold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? "text-indigo-600"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`hidden sm:block h-0.5 flex-1 mx-2 ${
                    idx < currentIndex ? "bg-teal-500" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
