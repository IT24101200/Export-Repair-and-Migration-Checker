"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileCheck2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // Sample record lookup for demonstration
  const reportData = {
    id,
    title: "Report — 24 September 2026",
    savedAt: "2026-09-24 18:30:12 UTC",
    engineVersion: "1.0.0",
    sourceFormat: "Notion (Markdown & CSV)",
    resultKind: "Repaired Copy",
    fileCount: 42,
    markdownCount: 28,
    checkedReferenceCount: 94,
    issueCountBefore: 7,
    issueCountAfter: 2,
    appliedChangeCount: 5,
    uncheckedFileCount: 2,
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this summary record?")) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="container-public py-10 max-w-3xl space-y-8">
      {/* Top navigation row */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to reports</span>
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete summary</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Saved Audit Record
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{reportData.title}</h1>
          <p className="text-xs text-slate-500 mt-1">Saved on {reportData.savedAt} · Engine v{reportData.engineVersion}</p>
        </div>

        {/* Mandatory Specification Disclaimer */}
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Metadata Summary Only</strong>
            <span>
              This record contains summary counts only. To inspect individual note files or run another repair, choose your original archive again in the workspace.
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Files</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{reportData.fileCount}</span>
            <span className="text-[11px] text-slate-400">{reportData.markdownCount} Markdown notes</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Links Checked</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{reportData.checkedReferenceCount}</span>
            <span className="text-[11px] text-slate-400">Internal targets</span>
          </div>
          <div className="p-4 rounded-lg bg-teal-50 border border-teal-100">
            <span className="text-[11px] font-semibold text-teal-700 block uppercase">Changes Applied</span>
            <span className="text-2xl font-bold text-teal-800 mt-1 block font-mono">{reportData.appliedChangeCount}</span>
            <span className="text-[11px] text-teal-600">Approved repairs</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Unchecked Files</span>
            <span className="text-2xl font-bold text-slate-700 mt-1 block font-mono">{reportData.uncheckedFileCount}</span>
            <span className="text-[11px] text-slate-400">CSV/HTML preserved</span>
          </div>
        </div>

        {/* Result status summary */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Format: {reportData.sourceFormat}</span>
          </div>
          <Link
            href="/check"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
          >
            <span>Scan Another File</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
