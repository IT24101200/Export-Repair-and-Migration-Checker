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
  const currentIndex = Math.max(0, getStepIndex(currentStep));
  const activeStep = steps[currentIndex] || steps[0];

  return (
    <nav aria-label="Workflow progress" className="w-full">
      {/* Mobile-only compact progress header (UI-04) */}
      <div className="sm:hidden flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Step {activeStep.number} of 5 — <span className="text-indigo-600 dark:text-indigo-400">{activeStep.label}</span>
        </span>
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-5 bg-indigo-600 dark:bg-indigo-400"
                  : idx < currentIndex
                  ? "w-2 bg-teal-500 dark:bg-teal-400"
                  : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stepper bar (Full on tablets & desktop, compact points on mobile) */}
      <ol className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-3xl mx-auto">
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
                className={`flex items-center gap-2 group w-full text-left focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:rounded-lg ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-teal-600 text-white"
                      : isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/60"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : step.number}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-semibold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isCompleted
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 sm:mx-2 ${
                    idx < currentIndex ? "bg-teal-500 dark:bg-teal-400" : "bg-slate-200 dark:bg-slate-700"
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
