"use client";

import { useState } from "react";
import { IssueItem } from "@/lib/types/workspace";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileCode,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface IssueDrawerProps {
  issue: IssueItem | null;
  onClose: () => void;
  onApprove: (issueId: string, chosenTarget?: string) => void;
  onSkip: (issueId: string) => void;
}

export default function IssueDrawer({ issue, onClose, onApprove, onSkip }: IssueDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [customTarget, setCustomTarget] = useState<string>("");

  if (!issue) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(issue.sourceFile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTarget = customTarget || issue.suggestedTarget;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Issue Inspection
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
              issue.severity === "error"
                ? "bg-red-100 text-red-800"
                : issue.severity === "warning"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {issue.category.replace(/_/g, " ")}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
        {/* Source file location */}
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 block text-xs">Source Note File</span>
          <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-mono text-[11px] truncate text-slate-800" title={issue.sourceFile}>
              {issue.sourceFile}
            </span>
            <button
              type="button"
              onClick={handleCopyPath}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          {issue.line && (
            <span className="text-[11px] text-slate-500">Found on line {issue.line}</span>
          )}
        </div>

        {/* Explanation */}
        <div className="space-y-1.5">
          <span className="font-semibold text-slate-900 block">Diagnosis</span>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
            {issue.explanation}
          </p>
        </div>

        {/* Text Excerpt (Safely escaped text) */}
        {issue.codeSnippet && (
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 block">Source Excerpt</span>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {issue.codeSnippet}
            </pre>
            <span className="text-[10px] text-slate-400">
              Rendered strictly as plain text for security.
            </span>
          </div>
        )}

        {/* Destination Comparison */}
        <div className="space-y-3">
          <span className="font-semibold text-slate-900 block">Link Destination Change</span>

          {/* Original */}
          <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
              Original Target (Broken)
            </span>
            <p className="font-mono text-[11px] text-red-900 break-all">
              {issue.originalTarget}
            </p>
          </div>

          {/* Proposed / Candidate target */}
          {issue.candidates && issue.candidates.length > 0 ? (
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                {issue.candidates.length === 1 ? "Proposed Safe Repair (Unique Match)" : "Select Target File"}
              </span>

              {issue.candidates.length === 1 ? (
                <p className="font-mono text-[11px] text-teal-900 break-all">
                  {issue.suggestedTarget}
                </p>
              ) : (
                <div className="space-y-1">
                  <label htmlFor="candidateSelect" className="text-[11px] text-teal-800 block">
                    Choose one of the existing candidates:
                  </label>
                  <select
                    id="candidateSelect"
                    value={customTarget || issue.candidates[0]}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-teal-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {issue.candidates.map((cand, idx) => (
                      <option key={idx} value={cand}>
                        {cand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {issue.reason && (
                <p className="text-[11px] text-teal-700 pt-1 border-t border-teal-100">
                  <strong>Reason:</strong> {issue.reason}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
              No matching candidate file found in this archive. This link will be preserved unchanged unless you choose to skip it.
            </div>
          )}
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        {selectedTarget ? (
          <button
            type="button"
            onClick={() => onApprove(issue.id, selectedTarget)}
            className="w-full py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Link Repair</span>
          </button>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSkip(issue.id)}
            className="flex-1 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
