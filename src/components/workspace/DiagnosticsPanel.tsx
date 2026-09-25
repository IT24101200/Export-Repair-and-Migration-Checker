"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Download, X, ShieldCheck } from "lucide-react";
import { WorkspaceSummary } from "@/lib/types/workspace";

interface DiagnosticsPanelProps {
  summary: WorkspaceSummary | null;
  stage: string;
  errorCode?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DiagnosticsPanel({
  summary,
  stage,
  errorCode,
  isOpen,
  onClose,
}: DiagnosticsPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the safe diagnostic object (Strictly NO file names, paths, note text, or emails)
  const diagnosticData = {
    diagnosticSchemaVersion: 1,
    engineVersion: summary?.engineVersion || "1.0.0",
    sourceFormat: summary?.sourceFormat || "notion_markdown_csv",
    processingStage: stage,
    errorCode: errorCode || "NONE",
    metrics: {
      fileCount: summary?.fileCount || 0,
      markdownCount: summary?.markdownCount || 0,
      checkedReferenceCount: summary?.checkedReferenceCount || 0,
      issuesDetected: summary?.issueCountBefore || 0,
      changesApplied: summary?.appliedChangeCount || 0,
      uncheckedFiles: summary?.uncheckedFileCount || 0,
      sizeCategory: summary?.archiveSizeBytes
        ? summary.archiveSizeBytes > 10 * 1024 * 1024
          ? "> 10 MiB"
          : "< 10 MiB"
        : "unknown",
    },
    clientTimestamp: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(diagnosticData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagnostic_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
            <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Technical Diagnostics</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          This diagnostic snapshot contains technical counts and error codes only. It excludes private filenames, note texts, hashes, and account credentials.
        </p>

        {/* Code Block */}
        <pre className="p-3.5 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-lg text-xs font-mono max-h-56 overflow-y-auto overflow-x-auto whitespace-pre border border-transparent dark:border-slate-800">
          {jsonString}
        </pre>

        <div className="flex items-center gap-2 text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-lg border border-teal-200 dark:border-teal-900">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Safe to share for troubleshooting. No personal notes included.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy JSON"}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
