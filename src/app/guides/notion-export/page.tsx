import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";

export default function NotionExportGuidePage() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      {/* Back button */}
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to guides</span>
      </Link>

      {/* Guide Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          How to Export from Notion for Migration
        </h1>
        <p className="text-slate-500 text-xs mt-2">Last updated: September 2026 · Estimated reading time: 3 mins</p>
      </div>

      {/* Guide Content */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Why Notion Export Settings Matter</h2>
          <p>
            When migrating from Notion to another tool (such as Obsidian, Logseq, or local Markdown vaults), Notion packages your notes into a compressed ZIP file. If exported with incorrect options, links between subpages can become broken or point to online web URLs instead of local files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Recommended Export Steps in Notion</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              In your Notion sidebar, click on <strong>Settings &amp; members</strong> (or open page options via the <strong>•••</strong> icon at the top right of a page).
            </li>
            <li>
              Select <strong>Export all workspace content</strong> (or <strong>Export page</strong> for individual notebooks).
            </li>
            <li>
              In the Export format dropdown, choose <strong>Markdown &amp; CSV</strong>.
            </li>
            <li>
              Under <em>Include content</em>, ensure <strong>Everything</strong> is selected to keep attached images and files.
            </li>
            <li>
              Under <em>Include subpages</em>, turn the toggle <strong>ON</strong>.
            </li>
            <li>
              Under <em>Create folders for subpages</em>, select <strong>Toggle ON</strong> if you want hierarchical subfolder structure.
            </li>
            <li>
              Click <strong>Export</strong> and wait for Notion to generate your ZIP download.
            </li>
          </ol>
        </section>

        <section className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Important Notion Limitations</span>
          </div>
          <p className="text-xs leading-relaxed">
            Notion exports append a random 32-character hex ID (e.g. <code>My Note 7f102a.md</code>) to filenames and folders. Often, links written in Markdown reference the clean title (<code>My Note.md</code>) or an unescaped path, which breaks when opening in Obsidian. This tool detects and repairs those exact mismatches!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. What to do next</h2>
          <p>
            Once your ZIP file has finished downloading from Notion, open our workspace and select the ZIP file to run a check.
          </p>
          <div className="pt-2">
            <Link
              href="/check"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              Check your export now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
