"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { MagneticButton } from "@/components/ui/motion-footer";
import RandomLetterSwapNav from "@/components/ui/m-random-letter-swap-1";

// Header component with responsive navigation, theme toggle, and mobile drawer
export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/check", label: "Check an export" },
    { href: "/check?sample=true", label: "Try Demo" },
    { href: "/guides", label: "Guides" },
    { href: "/changelog", label: "Changelog" },
    { href: "/help", label: "Help" },
  ];

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between h-16">
        {/* Product logo and title */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:rounded"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="tracking-tight font-bold">Export Repair</span>
        </Link>

        {/* Center: Modern Floating Pill RandomLetterSwapNav */}
        <div className="hidden md:flex items-center justify-center">
          <RandomLetterSwapNav
            items={navLinks}
            activePath={pathname}
          />
        </div>

        {/* Right Desktop Actions: Theme Toggle + Magnetic CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <MagneticButton
            href="/check"
            className="footer-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-xs transition-colors shadow-sm"
          >
            <span>Start Check</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </MagneticButton>
        </div>

        {/* Mobile controls: Theme toggle + hamburger menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation sheet & backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 md:hidden flex flex-col bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/check"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center min-h-[44px] w-full rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <span>Start Export Check</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
          {/* Overlay click to dismiss */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
