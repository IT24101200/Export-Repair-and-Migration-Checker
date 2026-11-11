import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CircleHelp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Troubleshoot Common Notion Export Problems",
  description:
    "Troubleshoot missing pages, broken Markdown links, missing images, long paths, CSV limitations, and other common Notion export problems before migration.",
  alternates: { canonical: "/guides/troubleshoot-notion-export-problems" },
};

export default function TroubleshootNotionExportProblemsGuide() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      <Link href="/guides" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to guides</span>
      </Link>

      <header>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <CircleHelp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Troubleshooting Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Troubleshooting Common Notion Export Problems
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Use the symptom first: determine whether the problem occurred during export, inside the ZIP, while extracting it, or after importing it into another app.
        </p>
      </header>

      <article className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-7 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">The export is missing pages</h2>
          <p>
            Confirm that subpages were included and that your account could access every page at export time. A local repair tool cannot restore a page that is not present in the ZIP. Re-export the relevant parent page or workspace after checking permissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Markdown links open the wrong file or nothing happens</h2>
          <p>
            Relative paths can stop resolving when exported pages live in ID-suffixed folders, filenames differ by letter case, or files are moved before import. Read the <Link href="/guides/notion-export-broken-links" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">broken Notion links guide</Link> for examples and supported repair behavior.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Images appear as broken placeholders</h2>
          <p>
            First check whether the referenced image exists anywhere in the archive. A wrong relative path may be repairable when exactly one matching image exists. If the file is absent, export again with files included. The <Link href="/guides/notion-export-missing-images" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">missing image troubleshooting guide</Link> explains both cases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Windows cannot extract the ZIP</h2>
          <p>
            Deeply nested subpages can create long paths. Extract closer to the drive root or use an extractor that supports long paths. Our checker reports archive paths over 120 characters as portability warnings but does not rename files. See the <Link href="/guides/notion-export-long-paths" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">long path guide</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Database content looks different after migration</h2>
          <p>
            Notion databases export as CSV files plus related page content. Export Repair inventories CSV files but deliberately does not rewrite links inside CSV cells or convert databases into Markdown tables, YAML properties, or destination-specific databases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">The archive is rejected by the checker</h2>
          <p>
            Use the original standard ZIP rather than an encrypted or multi-part archive. Current in-browser safety limits are 50 MiB and 2,500 entries. Larger exports need to be split at sensible parent pages and checked separately.
          </p>
        </section>
      </article>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <p>Always inspect a representative set of notes, links, and images after migration. A clean scan cannot guarantee that a destination app supports every Notion-specific block or database feature.</p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
          <p className="text-xs text-slate-700 dark:text-slate-300">Not sure which problem you have? Scan the ZIP and review the categorized findings.</p>
        </div>
        <Link href="/check" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm">
          <span>Open Export Checker</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
