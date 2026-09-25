"use client";

import { Badge7 } from "@/components/ui/cta69-utils/badge7";
import { Button12 } from "@/components/ui/cta69-utils/button12";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Cta69Labels {
  /** Repeated phrase scrolling across the backdrop */
  marqueePhrase?: string;
  /** Short supporting line beneath the heading */
  note?: string;
  /** Fine print sitting under the button */
  footnote?: string;
}

interface Cta69Props {
  badge?: Badge;
  heading?: string;
  button?: ActionButton;
  actions?: React.ReactNode;
  labels?: Cta69Labels;
  className?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}

export const cta69Demo: Cta69Props = {
  badge: { label: "Last word" },
  heading: "Let's make something worth keeping.",
  button: {
    label: "Start the conversation",
    href: "https://beste.co",
  },
  labels: {
    marqueePhrase: "Worth keeping",
    note: "No decks, no detours: one room, your problem, and a studio that ships.",
    footnote: "Booking two new partners for the autumn cycle.",
  },
};

/**
 * Repeat the ticker items so it forms an uninterrupted, infinite loop.
 */
const REPEATS = 6;

// Alternating stream rows running in both directions across the entire hero page
const STREAM_ROWS = [
  { direction: "left" as const, opacity: "opacity-60" },
  { direction: "right" as const, opacity: "opacity-45" },
  { direction: "left" as const, opacity: "opacity-50" },
  { direction: "right" as const, opacity: "opacity-40" },
  { direction: "left" as const, opacity: "opacity-45" },
  { direction: "right" as const, opacity: "opacity-55" },
  { direction: "left" as const, opacity: "opacity-40" },
  { direction: "right" as const, opacity: "opacity-50" },
];

export function Cta69({
  badge,
  heading,
  button,
  actions,
  labels = {},
  className,
  children,
  align = "left",
}: Cta69Props) {
  const marqueePhrase =
    labels.marqueePhrase ||
    "NOTION EXPORT REPAIR · 100% LOCAL PROCESSING · FIX RELATIVE LINKS · OBSIDIAN COMPATIBLE · RESTORE MISSING IMAGES · ZERO SERVER UPLOAD";
  const marqueeLine = `${marqueePhrase} · `.repeat(REPEATS);

  const isLeft = align === "left";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background py-16 sm:py-20 md:py-28 w-full",
        className
      )}
    >
      {/* 
        Full-Page Multi-Row Background Streams:
        Fills the entire hero section with continuous slow-moving streams alternating in both directions.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2 sm:py-4 overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {STREAM_ROWS.map((row, idx) => (
          <div
            key={idx}
            className={cn(
              "w-full whitespace-nowrap overflow-hidden select-none font-mono text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.26em] uppercase",
              row.direction === "left"
                ? "animate-marquee-left-slow"
                : "animate-marquee-right-slow",
              "text-slate-900/[0.045] dark:text-slate-100/[0.055]"
            )}
          >
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-block px-3">
                {marqueeLine}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Top and Bottom gradient fades to seamlessly blend into adjacent sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-background/60 to-background z-1"
      />

      {/* Subtle illumination aura for depth */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/[0.035] dark:bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none",
          isLeft
            ? "left-1/3 -translate-x-1/2"
            : "left-1/2 -translate-x-1/2"
        )}
      />

      {/* Main Content */}
      {isLeft ? (
        <div className="relative mx-auto w-full max-w-[96rem] px-4 sm:px-8 lg:px-12 xl:px-16 z-10">
          {children ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* Left Side: Hero Text & Actions */}
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left space-y-6 w-full">
                {badge && <Badge7 label={badge.label} />}

                {heading && (
                  <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-slate-50 drop-shadow-xs">
                    {heading}
                  </h1>
                )}

                {labels.note && (
                  <p className="max-w-2xl xl:max-w-3xl text-balance text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {labels.note}
                  </p>
                )}

                {(button || actions) && (
                  <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                    {button && (
                      <Button12 asChild label={button.label}>
                        <Link href={button.href} />
                      </Button12>
                    )}
                    {actions}
                  </div>
                )}

                {labels.footnote && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium pt-2">
                    {labels.footnote}
                  </p>
                )}
              </div>

              {/* Right Side: Interactive Preview / Demo Card */}
              <div className="lg:col-span-5 xl:col-span-5 w-full flex flex-col items-stretch">
                {children}
              </div>
            </div>
          ) : (
            <div className="flex max-w-4xl xl:max-w-5xl flex-col items-start text-left space-y-6">
              {badge && <Badge7 label={badge.label} />}

              {heading && (
                <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-slate-50 drop-shadow-xs">
                  {heading}
                </h1>
              )}

              {labels.note && (
                <p className="max-w-3xl text-balance text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {labels.note}
                </p>
              )}

              {(button || actions) && (
                <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                  {button && (
                    <Button12 asChild label={button.label}>
                      <Link href={button.href} />
                    </Button12>
                  )}
                  {actions}
                </div>
              )}

              {labels.footnote && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium pt-2">
                  {labels.footnote}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Centered Fallback Layout */
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 z-10">
          {badge && <Badge7 label={badge.label} />}

          {heading && (
            <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-slate-950 dark:text-slate-50 drop-shadow-xs">
              {heading}
            </h1>
          )}

          {labels.note && (
            <p className="mt-5 max-w-2xl text-balance text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {labels.note}
            </p>
          )}

          {(button || actions) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {button && (
                <Button12 asChild label={button.label}>
                  <Link href={button.href} />
                </Button12>
              )}
              {actions}
            </div>
          )}

          {/* Slot for preview cards & secondary triggers */}
          {children}

          {labels.footnote && (
            <p className="mt-8 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {labels.footnote}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default Cta69;
