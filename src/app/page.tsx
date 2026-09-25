import Link from "next/link";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  FileText,
  ChevronRight,
} from "lucide-react";

import { Cta69 } from "@/components/ui/cta69";
import { MagneticButton } from "@/components/ui/motion-footer";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section: Modern Cta69 with left-aligned text and full-page slow bidirectional streams */}
      <Cta69
        align="left"
        badge={{ label: "Local in-browser privacy · Notion to Obsidian" }}
        heading="Check your export. Review the fixes. Download a cleaner copy."
        button={{
          label: "Check my export",
          href: "/check",
        }}
        actions={
          <MagneticButton
            href="/check?sample=true"
            className="footer-glass-pill inline-flex items-center gap-2 px-6 py-3 rounded-full text-foreground text-xs font-semibold shadow-sm transition-colors hover:border-teal-500/40"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Try a synthetic sample</span>
          </MagneticButton>
        }
        labels={{
          marqueePhrase: "NOTION EXPORT REPAIR · 100% LOCAL PROCESSING · FIX RELATIVE LINKS · OBSIDIAN COMPATIBLE · RESTORE MISSING IMAGES · ZERO SERVER UPLOAD",
          note: "Fix broken relative links and missing image paths in your Notion Markdown & CSV export before importing into Obsidian or other note tools.",
          footnote: "Your archive is processed 100% securely on this device · Zero server upload · Original stays untouched",
        }}
        className="pt-10 sm:pt-16 pb-12 md:pb-16"
      >
        {/* Synthetic Sample Preview Card on the Right */}
        <div className="w-full bg-indigo-50/50 dark:bg-slate-900/80 rounded-2xl border border-indigo-100/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm text-left space-y-5 backdrop-blur-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-indigo-100/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                Sample Inspection Preview
              </span>
            </div>
            <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              Synthetic Demo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Broken Target Example */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Broken Relative Link
              </span>
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                [Sprint Planning](Sprint%20Planning.md)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Target file was nested in a subfolder with Notion export ID.
              </p>
            </div>

            {/* Proposed Repair Example */}
            <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Proposed Safe Repair (Unique Match)
              </span>
              <p className="font-mono text-xs text-teal-900 dark:text-teal-200 truncate">
                [Sprint Planning](Meeting%20Notes/Sprint%20Planning%207f102a.md)
              </p>
              <p className="text-[11px] text-teal-700 dark:text-teal-300">
                Unambiguous candidate identified by title and page ID.
              </p>
            </div>
          </div>

          <div className="pt-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Requires approval before saving
            </span>
            <Link
              href="/check?sample=true"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <span>Launch interactive run</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Cta69>

      {/* Scope Strip: seamlessly blended directly below hero */}
      <section className="container-public -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-md text-center md:text-left transition-colors">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Notion Markdown &amp; CSV</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supports standard ZIP exports</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Works without an account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Zero mandatory sign-up</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Original stays unchanged</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Creates a clean, verified copy</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container-public">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">How it works</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Simple, transparent 4-step repair process</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Choose ZIP file</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select your Notion Markdown &amp; CSV export. The file stays completely on your computer.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Scan references</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Finds broken relative note links, missing image references, and casing mismatches.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Review fixes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Approve suggested destination edits one-by-one or in batch. You have full control.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Download clean ZIP</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get your updated notes plus comprehensive audit reports (HTML, JSON, change logs).
            </p>
          </div>
        </div>
      </section>

      {/* What it checks and what results mean */}
      <section className="container-public">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">What it checks</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span><strong>Markdown links:</strong> Identifies broken relative paths between exported notes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span><strong>Local image references:</strong> Verifies embedded diagrams and attachments exist.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span><strong>Path portability:</strong> Flags deeply nested folder paths that may fail on Windows extractions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span><strong>Unchecked content:</strong> Clearly notes when CSV files or raw HTML blocks are skipped.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">What results mean</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span><strong>Can review a fix:</strong> A unique candidate file was found in the archive ready for your approval.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <span><strong>Needs manual attention:</strong> Ambiguous matches (multiple candidates) or missing files that cannot be recreated.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong>Not checked:</strong> Remote external web links (http/https) and CSV cell contents are deliberately untouched.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-public">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Does my export file get uploaded to your servers?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              No. Processing happens 100% inside your browser using Web Workers and JavaScript. Your notes, images, and file paths never leave your device.
            </p>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Does this tool change my original ZIP archive?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Never. Your input file is read-only. We generate a brand new, verified clean ZIP containing only the approved changes, alongside a full audit report.
            </p>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Can this tool recover missing files that were not in my Notion export?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              No. We can only repair references to files that actually exist inside your exported archive. If a subpage was excluded during export, we flag it as an unresolved reference.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
