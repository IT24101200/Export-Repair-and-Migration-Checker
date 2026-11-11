import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Repair a Notion Markdown Export Before Migration",
  description:
    "Learn how to inspect and repair broken relative links and image paths in a Notion Markdown export before moving it to Obsidian or another notes app.",
  alternates: { canonical: "/guides/repair-notion-markdown-export" },
};

export default function RepairNotionMarkdownExportGuide() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      <Link href="/guides" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to guides</span>
      </Link>

      <header>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Repair Workflow</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          How to Repair a Notion Markdown Export Before Migration
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          A safe workflow for checking a Notion Markdown and CSV ZIP, reviewing supported repairs, and testing the result before importing it into Obsidian or another Markdown app.
        </p>
      </header>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl text-xs text-teal-950 dark:text-teal-200">
        <p className="leading-relaxed">
          <strong>Start with a copy.</strong> Keep the original Notion ZIP untouched. Export Repair reads the archive locally in your browser and creates a separate ZIP only after you approve supported changes.
        </p>
      </div>

      <article className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-7 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">1. Export the correct Notion format</h2>
          <p>
            Choose <strong>Markdown &amp; CSV</strong> and include subpages and files. Keep the downloaded archive zipped for the checker. If you need detailed export steps, read the <Link href="/guides/notion-export" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Notion export guide</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">2. Scan local Markdown references</h2>
          <p>
            The checker reads Markdown files and compares their relative note and image destinations with files that actually exist in the ZIP. It also reports case mismatches and long paths that may be difficult to extract on Windows.
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-teal-600 shrink-0" aria-hidden="true" /><span>Healthy references are left unchanged.</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-teal-600 shrink-0" aria-hidden="true" /><span>A unique matching file can become a repair suggestion.</span></li>
            <li className="flex gap-2"><AlertTriangle className="w-4 h-4 mt-1 text-amber-600 shrink-0" aria-hidden="true" /><span>Multiple matches stay unresolved until you review them.</span></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">3. Review every proposed repair</h2>
          <p>
            Compare the original destination with the proposed file. Approve only targets that match the intended note or image. The tool does not silently guess when filenames are ambiguous. See <Link href="/guides/understanding-results" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">how to interpret scan results</Link> before approving a large batch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">4. Download and test the repaired copy</h2>
          <p>
            Extract the new ZIP into a fresh folder. Open several linked notes and image-heavy pages in the destination app, then read the included audit report for skipped or unresolved items. Do not overwrite your original export during testing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">What this repair does not do</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
            <li>It cannot recreate a note or image that is absent from the export.</li>
            <li>It does not verify external websites or heading fragments.</li>
            <li>It leaves links inside CSV cells and raw HTML unchanged.</li>
            <li>It does not convert Notion databases, callouts, or properties into Obsidian-specific formats.</li>
          </ul>
        </section>
      </article>

      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
          <p className="text-xs text-slate-700 dark:text-slate-300">Run a private, in-browser check before importing your Markdown export.</p>
        </div>
        <Link href="/check" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm">
          <span>Check Notion Export</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
