import Link from "next/link";
import { Lock, ShieldCheck, Database, HardDrive } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Security &amp; Privacy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-xs mt-2">Effective date: 24 September 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <h2>1. Local Device Processing Architecture</h2>
          </div>
          <p>
            The fundamental design principle of this application is client-side execution. When you select a Notion export ZIP file on the <code>/check</code> page:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Your archive is extracted and read entirely in your browser&apos;s Web Worker thread.</li>
            <li>No note contents, filenames, image data, or directory structures are uploaded to our servers.</li>
            <li>The repaired archive is synthesized in local browser memory and downloaded directly to your disk.</li>
            <li>When you close or refresh the browser tab, all archive contents in memory are discarded.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2>2. Optional Account Metadata</h2>
          </div>
          <p>
            You can use the tool completely anonymously without signing in. If you choose to sign in and click &ldquo;Save Scan Summary&rdquo;, only high-level summary metadata is transmitted:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Your authenticated email address.</li>
            <li>Timestamp and tool engine version (e.g., <code>1.0.0</code>).</li>
            <li>Numeric counts: total file count, Markdown note count, issues detected, and changes applied.</li>
            <li><strong>Never transmitted:</strong> note text, file names, file paths, image attachments, or code excerpts.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2>3. Account &amp; Data Deletion</h2>
          </div>
          <p>
            You retain complete control over any saved summary counts. You can delete individual reports at any time from your Dashboard, or delete your entire account and all associated summaries with one click in Account Settings.
          </p>
        </section>
      </div>
    </div>
  );
}
