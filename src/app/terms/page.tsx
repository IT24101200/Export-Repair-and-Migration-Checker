import Link from "next/link";
import { FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 text-xs mt-2">Last updated: September 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Nature of the Service</h2>
          <p>
            Export Repair and Migration Checker is an independent diagnostic and file preparation utility designed to inspect and fix relative file links inside Notion Markdown and CSV ZIP archives.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Limitations of Liability &amp; Disclaimers</h2>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Independent Tool Notice</span>
            </div>
            <p className="text-xs leading-relaxed">
              This application is not created, sponsored, or certified by Notion Labs, Inc. or Obsidian. The software is provided &ldquo;as is&rdquo;, without warranty of any kind. You should always preserve your original Notion ZIP download untouched.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            While we apply strict validation before generating new ZIP files, the user is responsible for testing their repaired export in their chosen note-taking application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. User Responsibilities</h2>
          <p>
            You agree not to attempt to upload malformed or malicious archives designed to exploit local browser decompression libraries. You maintain sole ownership and responsibility for the content of your notes.
          </p>
        </section>
      </div>
    </div>
  );
}
