import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href?: string;
}

const defaultLinks: (string | NavItem)[] = [
  "Home",
  "Work",
  "About",
  "Blog",
  "Contact",
];

interface RandomLetterSwapNavProps {
  items?: (string | NavItem)[];
  className?: string;
  navClassName?: string;
  activePath?: string;
}

export default function RandomLetterSwapNav({
  items = defaultLinks,
  className,
  navClassName,
  activePath,
}: RandomLetterSwapNavProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <nav
        className={cn(
          "flex items-center gap-6 lg:gap-7 px-5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-colors",
          navClassName
        )}
      >
        {items.map((item) => {
          const label = typeof item === "string" ? item : item.label;
          const href = typeof item === "string" ? undefined : item.href;
          const isActive =
            href &&
            (activePath === href ||
              (href !== "/" && activePath?.startsWith(href)));

          if (href) {
            return (
              <Link
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "py-1 relative inline-flex items-center rounded text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </Link>
            );
          }

          return <span key={label}>{label}</span>;
        })}
      </nav>
    </div>
  );
}

export { RandomLetterSwapNav };
