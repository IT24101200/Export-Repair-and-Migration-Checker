import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckSquare, ShieldCheck, CheckCircle2, FileCheck } from "lucide-react";

export const metadata = {
  title: "Pre-Migration Checklist: Check Your Notion Export — Export Repair Checker",
  description: "A 5-step verification checklist before moving Notion export files to Obsidian or other Markdown tools.",
};

export default function CheckNotionExportBeforeMovingGuide() {
  const checklistSteps = [
    {
      num: "1",
      title: "Keep Your Original Downloaded ZIP Untouched",
      desc: "Always store a pristine copy of your original Notion export ZIP in a separate backup location. If you ever need to re-verify an unresolved link or compare against original raw bytes, your untouched backup ensures you never lose data.",
    },
    {
      num: "2",
      title: "Inspect Files Locally Before Importing",
      desc: "Run your ZIP through our in-browser checker to review broken relative links, missing images, and long paths. Review candidate targets and approve suggested fixes.",
    },
    {
      num: "3",
      title: "Extract the Repaired Archive into a Fresh Destination",
      desc: "Do not overwrite your original directory. Extract the newly downloaded repaired ZIP into a dedicated test folder, such as C:\\MigrationTest\\, to ensure extraction succeeds cleanly.",
    },
    {
      num: "4",
      title: "Spot-Check Critical Pages and Embedded Media",
      desc: "Open 3 to 5 of your most heavily interlinked documents and pages with image attachments in a local viewer. Click the links to verify that targets open smoothly.",
    },
    {
      num: "5",
      title: "Consult Your Destination App's Official Migration Guide",
      desc: "Every target tool has its own preferred import process (e.g. Obsidian Importer plugin, Logseq, or Foam). Follow the destination tool's official documentation for database properties, tags, and page frontmatter.",
    },
  ];

  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to guides</span>
      </Link>

      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Migration Checklist</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Pre-Migration Checklist: Check Your Notion Export Before Moving
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Avoid data loss, broken attachments, and confusing link errors by following this essential 5-step verification checklist before importing Notion files into your new workspace.
        </p>
      </div>

      {/* Checklist items */}
      <div className="space-y-4">
        {checklistSteps.map((step) => (
          <div
            key={step.num}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/80">
              {step.num}
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{step.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300 transition-colors">
        <strong className="text-slate-900 dark:text-slate-100 font-semibold block flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Reviewing Your Local Audit Report
        </strong>
        <p className="leading-relaxed">
          Every repaired ZIP produced by our checker includes a dedicated <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">.export-repair-report/</code> folder with <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">report.html</code>. Open that file in any browser to see complete before-and-after audit logs and any unresolved links that require manual editing.
        </p>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Ready to check your Notion export? The checker runs entirely inside your browser.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
        >
          <span>Start Export Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
