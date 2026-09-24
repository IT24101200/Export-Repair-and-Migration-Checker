import Link from "next/link";
import { BookOpen, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="container-public py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation &amp; Guides</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Export &amp; Migration Guides
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-sm leading-relaxed">
          Learn how Notion exports files, why links break during migration, and how our tool inspects and fixes broken paths while keeping your data private.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/guides/notion-export"
          className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            How to Export from Notion for Migration
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Step-by-step instructions on exporting Notion workspaces to Markdown &amp; CSV with subpages, handling attachments, and selecting the correct export settings.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <span>Read guide</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/guides/understanding-results"
          className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Understanding Scan Results and Repairs
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Learn what each finding category means, how unique candidate suggestions are calculated, and what requires manual attention before downloading.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <span>Read guide</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Helpful Banner */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <p className="text-xs text-slate-700">
            Ready to inspect your files? You can test the workflow with your own ZIP or try our synthetic sample archive.
          </p>
        </div>
        <Link
          href="/check"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shrink-0 transition-colors"
        >
          Open Workspace
        </Link>
      </div>
    </div>
  );
}
