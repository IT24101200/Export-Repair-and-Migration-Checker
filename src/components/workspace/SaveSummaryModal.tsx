"use client";

import { useState } from "react";
import { WorkspaceSummary } from "@/lib/types/workspace";
import { X, ShieldCheck, Check, Database, AlertCircle } from "lucide-react";

interface SaveSummaryModalProps {
  summary: WorkspaceSummary;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: () => void;
}

export default function SaveSummaryModal({
  summary,
  isOpen,
  onClose,
  onConfirmSave,
}: SaveSummaryModalProps) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        clientResultId: summary.clientResultId || `res-${Date.now()}`,
        engineVersion: summary.engineVersion || "1.0.0",
        sourceFormat: summary.sourceFormat || "notion_markdown_csv",
        resultKind: summary.resultKind || "scan_only",
        fileCount: summary.fileCount,
        markdownCount: summary.markdownCount,
        checkedReferenceCount: summary.checkedReferenceCount,
        issueCountBefore: summary.issueCountBefore,
        issueCountAfter: summary.issueCountAfter,
        appliedChangeCount: summary.appliedChangeCount,
        uncheckedFileCount: summary.uncheckedFileCount,
        archiveName: summary.archiveName,
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to save summary.");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onConfirmSave();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not save summary to account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Save Scan Summary to Account</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          Here is the exact data that will be stored in your account history. Private note text, file names, and image contents are <strong className="text-slate-900">never transmitted</strong>.
        </p>

        {/* Exact JSON-like summary preview */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1 text-slate-700">
          <div>engineVersion: &quot;{summary.engineVersion}&quot;</div>
          <div>resultKind: &quot;{summary.resultKind}&quot;</div>
          <div>fileCount: {summary.fileCount}</div>
          <div>markdownCount: {summary.markdownCount}</div>
          <div>checkedReferenceCount: {summary.checkedReferenceCount}</div>
          <div>issueCountBefore: {summary.issueCountBefore}</div>
          <div>appliedChangeCount: {summary.appliedChangeCount}</div>
          <div>uncheckedFileCount: {summary.uncheckedFileCount}</div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded-lg border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Zero note files or archive contents leave your browser.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || success}
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            {success ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : saving ? (
              <span>Saving...</span>
            ) : (
              <span>Confirm &amp; Save</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
