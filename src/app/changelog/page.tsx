import Link from "next/link";
import { History, Tag, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Bug } from "lucide-react";

export const metadata = {
  title: "Changelog & Releases — Export Repair and Migration Checker",
  description: "Dated release history, supported changes, bug fixes, and current engine capabilities.",
};

export default function ChangelogPage() {
  const releases = [
    {
      version: "v1.1.0",
      date: "September 25, 2026",
      tag: "Phase 2 Release",
      badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
      summary: "Added non-sensitive local diagnostics, structured feedback submission, coverage breakdown details, and post-download opening checklist.",
      highlights: [
        {
          type: "feature",
          title: "Technical Diagnostics Panel",
          desc: "Inspect engine version, aggregate counts, source formats, and controlled error codes before copying or saving diagnostics locally. Zero private file paths, text excerpts, or user data included.",
        },
        {
          type: "feature",
          title: "Voluntary Structured Feedback",
          desc: "Signed-in users can voluntary rate outcome helpfulness and indicate any difficulty category directly on the download screen, with full self-service deletion in Account settings.",
        },
        {
          type: "feature",
          title: "Detailed Coverage Breakdown",
          desc: "Expandable breakdown in /check displaying supported checks (Markdown links, local images, reference links) alongside intentionally skipped categories (CSV contents, HTML embeds).",
        },
        {
          type: "fix",
          title: "Extension Hydration Shielding",
          desc: "Suppressed hydration attribute warnings originating from third-party browser extensions (such as DarkReader or grammar checkers).",
        },
      ],
      limitations: [
        "Filename shortening remains in planning (NEXT-10) pending user demand validation.",
        "Links inside CSV tables and raw HTML tags remain read-only/skipped.",
      ],
    },
    {
      version: "v1.0.0",
      date: "September 24, 2026",
      tag: "Initial Release",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      summary: "Initial public launch featuring local browser-only Notion Markdown/CSV ZIP inspection and safe candidate link repair.",
      highlights: [
        {
          type: "feature",
          title: "Local Device Processing Worker",
          desc: "Full ZIP inspection and repair performed completely in-memory inside the user's browser using @zip.js. Selected archives and note contents never leave the device.",
        },
        {
          type: "feature",
          title: "Interactive Finding Review & Approval",
          desc: "Review broken relative references, inspect unique candidate targets, and approve repairs before applying edits.",
        },
        {
          type: "feature",
          title: "Five-File Diagnostic Bundle",
          desc: "Repaired archives include report.json, report.html, changes.json, inventory.csv, and summary.md inside an isolated .export-repair-report/ folder.",
        },
        {
          type: "feature",
          title: "Synthetic Demo Sample",
          desc: "Built-in synthetic broken export to try the entire inspection and repair workflow without uploading personal files.",
        },
      ],
      limitations: [
        "External HTTP links and anchor headings are detected but intentionally left unverified.",
        "ZIP files larger than 100 MB or containing more than 5,000 files are blocked to prevent browser memory exhaustion.",
      ],
    },
  ];

  return (
    <div className="container-public py-12 space-y-10 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <History className="w-3.5 h-3.5" />
          <span>Release Notes</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Product Changelog &amp; Release History
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
          Track updates, feature additions, bug fixes, and known limitations in our export inspection and repair engine.
        </p>
      </div>

      {/* Releases Timeline */}
      <div className="space-y-8">
        {releases.map((rel) => (
          <div
            key={rel.version}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors"
          >
            {/* Version & Date */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {rel.version}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${rel.badgeClass}`}
                >
                  {rel.tag}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Released: {rel.date}
              </span>
            </div>

            {/* Release Summary */}
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {rel.summary}
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Changes &amp; Improvements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rel.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      {item.type === "fix" ? (
                        <Bug className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Limitations */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Known Scope &amp; Limitations</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {rel.limitations.map((limit, idx) => (
                  <li key={idx}>{limit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
            Have a Notion export to check?
          </h2>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed max-w-xl">
            Test your Markdown and CSV files with the latest verified engine. All processing runs privately on your device.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 shadow-sm transition-colors"
        >
          <span>Try current version</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
