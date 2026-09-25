"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { CinematicFooter } from "@/components/ui/motion-footer";

// Main footer component that selects between cinematic motion footer on home page
// and a compact, user-friendly footer on all other pages
export default function Footer() {
  const pathname = usePathname();

  // Show the full animated motion footer only on the main landing page
  if (pathname === "/") {
    return <CinematicFooter />;
  }

  // Small, user-friendly footer for all other pages
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-6 transition-colors">
      <div className="container-public flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand and privacy indicator */}
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span>Export Repair</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>100% In-Browser Privacy</span>
          </span>
        </div>

        {/* Quick navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-slate-600 dark:text-slate-400">
          <Link
            href="/check"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            Check an export
          </Link>
          <Link
            href="/guides"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/changelog"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Changelog
          </Link>
          <Link
            href="/help"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Help
          </Link>
          <Link
            href="/privacy"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Terms
          </Link>
        </nav>

        {/* Copyright notice */}
        <div className="text-slate-500 dark:text-slate-500 text-[11px] text-center md:text-right">
          &copy; {new Date().getFullYear()} Export Repair Checker · Zero server upload
        </div>
      </div>
    </footer>
  );
}
