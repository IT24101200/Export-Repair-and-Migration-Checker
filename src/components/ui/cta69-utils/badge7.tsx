import React from "react";
import { cn } from "@/lib/utils";

interface Badge7Props {
  label: string;
  className?: string;
}

export function Badge7({ label, className }: Badge7Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-slate-100/80 dark:bg-slate-800/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-xs transition-colors",
        className
      )}
    >
      <span className="size-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
      <span>{label}</span>
    </div>
  );
}
