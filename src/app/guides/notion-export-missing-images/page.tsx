import Link from "next/link";
import { ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Fix Missing Images and Paths in Notion Exports",
  description: "Fix broken image links in a Notion Markdown export by diagnosing wrong relative paths, case mismatches, missing files, and Obsidian import problems.",
  alternates: { canonical: "/guides/notion-export-missing-images" },
};

export default function NotionExportMissingImagesGuide() {
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
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Troubleshooting Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          How to Fix Broken Image Links in Notion Exports
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          When opening exported notes in Markdown apps, you might see broken image placeholders. Learn how to tell if an image simply has an incorrect link path or was completely left out of your export.
        </p>
      </div>

      {/* Quick summary box */}
      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-xl space-y-1.5 text-xs text-teal-950 dark:text-teal-200 transition-colors">
        <strong className="font-bold flex items-center gap-1.5 text-teal-800 dark:text-teal-300">
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Key Distinction
        </strong>
        <p className="leading-relaxed">
          If the image file is inside your ZIP but the note uses a mismatched subfolder, filename case, or encoded path, the checker can propose a corrected relative path for your approval. If the image was excluded during export, no local tool can recreate it without exporting again.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            Case 1: The Image File Is in the ZIP (Wrong Relative Path)
          </h2>
          <p>
            Notion puts images into companion asset folders named after the page ID. When a Markdown reference like <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">![Diagram](diagram.png)</code> fails to account for the subfolder <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">page_id_folder/diagram.png</code>, offline viewers cannot display it.
          </p>
          <p>
            <strong className="text-slate-900 dark:text-slate-100">How our tool handles this:</strong> The checker scans the archive member directory, identifies the unique matching image file, and proposes a corrected relative destination (e.g. <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200 font-mono">![Diagram](./assets_folder/diagram.png)</code>) for your approval.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            Case 2: The Image Was Excluded from the Export (Missing File)
          </h2>
          <p>
            Sometimes the note references an image, but the image file does not exist anywhere in the ZIP. Common causes include:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-400 dark:marker:text-slate-500">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Exporting Without Media:</strong> During Notion export, selecting &ldquo;Exclude images&rdquo; or exporting with limited subpage depth skips embedded assets.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">External Cloud Storage Links:</strong> Images linked from Google Drive, Unsplash, or AWS S3 signed URLs expire after export or require internet connectivity.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Permission Blocked Assets:</strong> Images embedded from third-party Notion workspaces where you do not have permission to download raw attachments.
            </li>
          </ul>
          <p>
            <strong className="text-slate-900 dark:text-slate-100">How our tool handles this:</strong> Our tool honestly flags these as <em>Missing Image Assets</em> in your scan report. We never invent placeholder images or hide missing files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            Fixing Notion-to-Obsidian Broken Images
          </h2>
          <ol className="list-decimal pl-5 space-y-2 marker:text-slate-400 dark:marker:text-slate-500">
            <li>Confirm the image exists inside the original Notion ZIP before moving any folders.</li>
            <li>Compare the Markdown destination with the image&apos;s actual relative location and filename case.</li>
            <li>Use the checker to review a unique matching image and approve the proposed path only when it is correct.</li>
            <li>Extract the repaired copy into a fresh folder and open several image-heavy notes in Obsidian.</li>
          </ol>
          <p>
            Export Repair keeps standard Markdown image syntax. It does not reorganize every attachment into an Obsidian attachments folder or convert embeds into wiki-link syntax.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
            How to Re-export Notion Notes with Full Images
          </h2>
          <ol className="list-decimal pl-5 space-y-2 marker:text-slate-400 dark:marker:text-slate-500">
            <li>Open Notion workspace Settings &rarr; Export all workspace content.</li>
            <li>Set the export format to <strong className="text-slate-900 dark:text-slate-100">Markdown &amp; CSV</strong>.</li>
            <li>Ensure &ldquo;Include content&rdquo; is set to <strong className="text-slate-900 dark:text-slate-100">Everything</strong> (not No files or images).</li>
            <li>Download the new ZIP and run it through our checker to verify all image links resolve locally.</li>
          </ol>
          <p>
            If links and images both fail, follow the complete <Link href="/guides/repair-notion-markdown-export" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Notion Markdown export repair workflow</Link> before importing again.
          </p>
        </section>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Check your export to see which images are resolved and which are missing.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-sm"
        >
          <span>Open Checker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
