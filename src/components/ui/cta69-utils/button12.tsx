import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/motion-footer";

interface Button12Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  asChild?: boolean;
  children?: React.ReactElement<any>;
  className?: string;
}

export function Button12({
  label,
  asChild,
  children,
  className,
  ...props
}: Button12Props) {
  const content = (
    <span className="relative z-10 inline-flex items-center gap-2">
      <span>{label}</span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  );

  const baseClasses = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-sm font-semibold shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-300 cursor-pointer",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
    return (
      <MagneticButton as="div" className="inline-block">
        {React.cloneElement(child, {
          className: cn(baseClasses, child.props?.className),
          children: content,
        })}
      </MagneticButton>
    );
  }

  return (
    <MagneticButton as="button" className={baseClasses} {...props}>
      {content}
    </MagneticButton>
  );
}
