import Link from "next/link";
import { ArrowLeft, ArrowRight, FolderTree, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Notion Export Long Paths Guide — Export Repair Checker",
  description: "Understand path length warnings in Notion exports and how to prevent extraction errors on Windows.",
};

export default function NotionExportLongPathsGuide() {
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
          <FolderTree className="w-3.5 h-3.5" />
          <span>Troubleshooting Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Handling Long File Paths and Notion Export Path Warnings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Notion's nested pages, database views, and 32-character ID suffixes can produce file paths exceeding 260 characters. Learn how to prevent extraction failures on Windows and macOS.
        </p>
      </div>

      {/* Advisory box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200 transition-colors">
        <strong className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Why Long Paths Cause Failures
        </strong>
        <p className="leading-relaxed">
          Standard Windows installations limit path lengths to 260 characters (<code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-amber-950 dark:text-amber-100">MAX_PATH</code>). If an extracted file path exceeds this limit, Windows Explorer will fail with errors like &ldquo;Path too long&rdquo; or silently skip files during extraction.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            1. Why Notion Produces Unusually Long Paths
          </h2>
          <p>
            In Notion, nesting pages inside subpages and databases creates hierarchical directories upon export. Furthermore, every folder and file receives a 32-character hexadecimal identifier:
          </p>
          <div className="bg-slate-950 border border-slate-800 text-slate-100 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
            Workspace Name/Engineering Team 4b8d765e94b2/Sprint Planning 91b4274c5d32/Q4 Architecture Roadmap and System Design Requirements 1234567890abcdef.md
          </div>
          <p>
            When you extract this archive into your user profile (e.g. <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">C:\Users\Username\Documents\NotionExports\...</code>), the overall combined path easily surpasses 260 characters.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            2. Practical Steps to Extract Safely Right Now
          </h2>
          <ol className="list-decimal pl-5 space-y-2 marker:text-slate-400 dark:marker:text-slate-500">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Extract to Root Drive:</strong> Instead of extracting into deep subfolders or your desktop, extract directly to a short root directory such as <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">C:\notion\</code> or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">D:\notes\</code>.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Use 7-Zip or Modern Extractors:</strong> The free tool 7-Zip supports long Unicode paths and bypasses Windows Explorer&apos;s standard path restrictions.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Enable Windows Long Paths:</strong> Windows 10 and 11 allow enabling Long Paths via Group Policy or Registry setting (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">LongPathsEnabled = 1</code>).
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            3. How Our Checker Identifies Path Risks
          </h2>
          <p>
            Our checker inspects the internal path length of every archive entry. Any file path over 180 characters inside the ZIP is flagged with a <em>Path Length Warning</em> in the scan report, giving you advance notice before you run into extraction barriers.
          </p>
          <p className="text-slate-500 dark:text-slate-400 italic">
            Note: Automatic filename shortening is in planning for Phase 2 (NEXT-10) and will be released only after complete incoming-reference dependency verification to guarantee no links break when files are shortened.
          </p>
        </section>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Check your export to see if any files risk triggering long path errors.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
        >
          <span>Run Path Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
