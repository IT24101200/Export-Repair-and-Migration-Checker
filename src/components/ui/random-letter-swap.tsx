"use client";

import { useState } from "react";
import { motion, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export interface RandomLetterSwapProps {
  label: string;
  reverse?: boolean;
  transition?: {
    type?: string;
    duration?: number;
    stiffness?: number;
    damping?: number;
    [key: string]: unknown;
  };
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * RandomLetterSwap
 * Animates text letters swapping vertically in a randomized sequence on hover.
 */
export function RandomLetterSwap({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.6,
  },
  staggerDuration = 0.025,
  className,
  onClick,
  ...props
}: RandomLetterSwapProps) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const hoverStart = () => {
    if (blocked) return;
    setBlocked(true);

    // Create a randomized order for letter swaps
    const shuffledIndices = Array.from(
      { length: label.length },
      (_, i) => i
    ).sort(() => Math.random() - 0.5);

    for (let i = 0; i < label.length; i++) {
      const randomIndex = shuffledIndices[i];
      const stepTransition = {
        ...transition,
        delay: i * staggerDuration,
      };

      animate(
        ".letter-" + randomIndex,
        {
          y: reverse ? "100%" : "-100%",
        },
        stepTransition as any
      ).then(() => {
        animate(
          ".letter-" + randomIndex,
          {
            y: 0,
          },
          {
            duration: 0,
          }
        );
      });

      animate(
        ".letter-secondary-" + randomIndex,
        {
          top: "0%",
        },
        stepTransition as any
      )
        .then(() => {
          animate(
            ".letter-secondary-" + randomIndex,
            {
              top: reverse ? "-100%" : "100%",
            },
            {
              duration: 0,
            }
          );
        })
        .then(() => {
          if (i === label.length - 1) {
            setBlocked(false);
          }
        });
    }
  };

  return (
    <motion.span
      className={cn(
        "inline-flex justify-center items-center relative overflow-hidden leading-none",
        className
      )}
      onHoverStart={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => (
        <span
          className="whitespace-pre relative inline-flex overflow-hidden py-0.5"
          key={i}
          aria-hidden={true}
        >
          <motion.span
            className={`relative inline-block letter-${i}`}
            style={{ top: 0 }}
          >
            {letter}
          </motion.span>
          <motion.span
            className={`absolute inline-block inset-x-0 letter-secondary-${i}`}
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default RandomLetterSwap;
