"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type MagneticButtonProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
};

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component, href, ...props }, forwardedRef) => {
    const localRef = React.useRef<HTMLElement>(null);

    const setRef = React.useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const element = localRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0) scale(1.03)`;
    };

    const handlePointerLeave = () => {
      const element = localRef.current;
      if (element) element.style.transform = "";
    };

    const sharedProps = {
      ...props,
      ref: setRef,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      className: cn(
        "cursor-pointer will-change-transform transition-transform duration-300 ease-out",
        className
      ),
    };

    if (href) {
      return (
        <Link href={href} {...sharedProps}>
          {children}
        </Link>
      );
    }

    const Tag = Component || "button";
    return <Tag {...sharedProps}>{children}</Tag>;
  }
);

MagneticButton.displayName = "MagneticButton";
