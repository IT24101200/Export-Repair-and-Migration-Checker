import Link from "next/link";
import { ArrowLeft, ArrowRight, Link2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Notion Export Broken Links Guide — Export Repair Checker",
  description: "Learn why Notion exports break relative Markdown links and how to repair them safely.",
};

export default function NotionExportBrokenLinksGuide() {
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
          <Link2 className="w-3.5 h-3.5" />
          <span>Troubleshooting Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Why Notion Exports Break Internal Links (and How to Fix Them)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          When exporting Notion pages to Markdown, links between pages often point to missing files or broken relative paths. Here is why it happens and how our tool repairs them safely.
        </p>
      </div>

      {/* Quick summary box */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200 transition-colors">
        <strong className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Quick Answer
        </strong>
        <p className="leading-relaxed">
          Notion appends 32-character hexadecimal IDs to subfolder names and page titles upon export, while in-text Markdown links sometimes retain older relative paths or unencoded spaces. When moved to another tool like Obsidian or a standard Markdown reader, these links fail to open.
        </p>
      </div>

      {/* Main explanation Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            1. The Anatomy of a Broken Notion Link
          </h2>
          <p>
            Consider a page named <em>Meeting Notes</em> linking to a document titled <em>Project Roadmap</em>. In Notion, the link works dynamically through workspace page IDs. But when exported to Markdown, the resulting files look like this:
          </p>
          <div className="bg-slate-950 border border-slate-800 text-slate-100 p-4 rounded-lg font-mono text-[11px] space-y-1">
            <p className="text-slate-400"># In Meeting Notes.md:</p>
            <p className="text-rose-400">[Project Roadmap](Project%20Roadmap.md)  <span className="text-slate-500">&lt;-- points here</span></p>
            <p className="text-slate-400 mt-2"># Actual filename created by Notion on disk:</p>
            <p className="text-teal-400">Project Roadmap 4b8d765e94b2413a91b4274c5d3298a1.md</p>
          </div>
          <p>
            Because the target file contains Notion's 32-character ID suffix on disk, your Markdown editor cannot find <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">Project Roadmap.md</code>, resulting in a dead link.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            2. Common Reasons Links Break in Notion ZIPs
          </h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-slate-400 dark:marker:text-slate-500">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">32-Character Hex ID Suffixes:</strong> Notion appends page IDs to folder and file names to prevent naming collisions, but internal Markdown links frequently omit or mismatch them.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">URL Encoding Mismatches:</strong> Spaces in filenames are sometimes written as <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">%20</code> and other times as raw spaces, confusing some offline Markdown viewers.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Nested Folder Shifts:</strong> Moving a page into a sub-database before export can alter its relative depth (e.g. requiring <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">../</code>), leaving parent links broken.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            3. How Our Checker Finds and Repairs Targets
          </h2>
          <p>
            Our in-browser engine scans every Markdown file and performs deterministic candidate matching:
          </p>
          <ol className="list-decimal pl-5 space-y-2 marker:text-slate-400 dark:marker:text-slate-500">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Exact Path Resolution:</strong> It tests if the link already points to an existing file in the archive. If healthy, it leaves it completely untouched.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Candidate Search:</strong> If broken, it strips URL encoding and searches for archive members whose base title and Notion ID match the intended destination.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Safety Verification:</strong> If exactly <em>one</em> unambiguous matching file is found, it presents it as a verified repair suggestion for your approval.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Ambiguity Protection:</strong> If multiple files share identical titles in different folders, it flags the issue for manual review rather than making an unsafe guess.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            4. Known Limits &amp; Boundaries
          </h2>
          <p>
            Our checker fixes supported relative Markdown links and local images. However:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-400 dark:marker:text-slate-500">
            <li>Links pointing to private Notion pages that were excluded during export cannot be recreated.</li>
            <li>Links embedded inside CSV database tables are flagged as read-only.</li>
            <li>External web URLs (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">https://...</code>) are not modified.</li>
          </ul>
        </section>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Want to see how this works without using personal data? Try our interactive synthetic sample.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
        >
          <span>Try Demo Sample</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
