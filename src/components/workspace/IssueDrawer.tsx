"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

interface IssueDrawerProps {
  issue: IssueItem | null;
  onClose: () => void;
  onApprove: (issueId: string, chosenTarget?: string) => void;
  onSkip: (issueId: string) => void;
}

// Generate contextual next action advice and guide links based on finding type
function getHelpfulNextAction(issue: IssueItem) {
  if (issue.category === "missing_image") {
    return {
      title: "Export again with files included",
      detail: "Notion may have excluded this image if 'Include content' was not set to 'Everything'. If the file is absent from the archive, it cannot be recovered locally.",
      guideHref: "/guides/notion-export-missing-images",
      guideTitle: "Missing Images Guide",
    };
  }

  if (issue.category === "ambiguous_target") {
    return {
      title: "Choose another target or edit manually",
      detail: "Multiple files match this title. Pick the intended subfolder destination from the dropdown above, or verify in your Markdown viewer.",
      guideHref: "/guides/notion-export-broken-links",
      guideTitle: "Broken Relative Links Guide",
    };
  }

  if (issue.category === "broken_note_link") {
    if (issue.candidates && issue.candidates.length > 1) {
      return {
        title: "Choose another target or edit manually",
        detail: "Multiple files match this title. Pick the intended destination from the dropdown above, or edit the source note directly.",
        guideHref: "/guides/notion-export-broken-links",
        guideTitle: "Broken Relative Links Guide",
      };
    }
    if (!issue.candidates || issue.candidates.length === 0) {
      return {
        title: "Check if the page was in another workspace",
        detail: "No matching file was found in this archive. Export again from Notion ensuring all subpages are included, or check workspace permissions.",
        guideHref: "/guides/notion-export-broken-links",
        guideTitle: "Broken Relative Links Guide",
      };
    }
    return {
      title: "Approve candidate repair",
      detail: "A unique unambiguous candidate was identified. Click 'Approve Link Repair' below to apply the destination update.",
      guideHref: "/guides/understanding-results",
      guideTitle: "Understanding Results Guide",
    };
  }

  if (issue.category === "long_path") {
    return {
      title: "Extract to root or enable Windows Long Paths",
      detail: "Extract your archive into a short directory path (like C:\\notes\\) to prevent Windows 260 MAX_PATH extraction failures.",
      guideHref: "/guides/notion-export-long-paths",
      guideTitle: "Long Paths Guide",
    };
  }

  if (issue.category === "unchecked_content" || issue.category === "unsupported_syntax") {
    return {
      title: "CSV & complex syntax kept read-only",
      detail: "Links inside database tables or unsupported formatting are preserved without modification to prevent corruption.",
      guideHref: "/guides/understanding-results",
      guideTitle: "Coverage Limitations Guide",
    };
  }

  if (issue.category === "case_mismatch") {
    return {
      title: "Approve casing repair",
      detail: "Align link letter casing with the actual filename on disk to avoid broken links on Linux, macOS, or static web hosts.",
      guideHref: "/guides/understanding-results",
      guideTitle: "Understanding Results Guide",
    };
  }

  return {
    title: "Review recommended target",
    detail: "Verify the original vs. proposed destination and approve if it matches your expected file.",
    guideHref: "/guides/understanding-results",
    guideTitle: "Understanding Results Guide",
  };
}

export default function IssueDrawer({ issue, onClose, onApprove, onSkip }: IssueDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [customTarget, setCustomTarget] = useState<string>("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (issue) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [issue, onClose]);

  if (!issue) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(issue.sourceFile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTarget = customTarget || issue.suggestedTarget;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      {/* Click outside to close backdrop */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Drawer Container */}
      <div className="w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full max-h-screen sm:max-h-[100dvh] overflow-hidden animate-in slide-in-from-right duration-150 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Issue Inspection
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                issue.severity === "error"
                  ? "bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60"
                  : issue.severity === "warning"
                  ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {issue.category.replace(/_/g, " ")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Source file location */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">Source Note File</span>
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
              <span className="font-mono text-[11px] truncate text-slate-800 dark:text-slate-200 er-long-text" title={issue.sourceFile}>
                {issue.sourceFile}
              </span>
              <button
                type="button"
                onClick={handleCopyPath}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 shrink-0 min-h-[36px] px-2 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            {issue.line && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Found on line {issue.line}</span>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">Diagnosis</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              {issue.explanation}
            </p>
          </div>

          {/* Text Excerpt (Safely escaped text) */}
          {issue.codeSnippet && (
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">Source Excerpt</span>
              <pre className="p-3 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-all er-long-text border border-transparent dark:border-slate-800">
                {issue.codeSnippet}
              </pre>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Rendered strictly as plain text for security.
              </span>
            </div>
          )}

          {/* Destination Comparison */}
          <div className="space-y-3">
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">Link Destination Change</span>

            {/* Original */}
            <div className="p-3 rounded-lg bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                Original Target (Broken)
              </span>
              <p className="font-mono text-[11px] text-red-900 dark:text-red-200 break-all er-long-text">
                {issue.originalTarget}
              </p>
            </div>

            {/* Proposed / Candidate target */}
            {issue.candidates && issue.candidates.length > 0 ? (
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
                  {issue.candidates.length === 1 ? "Proposed Safe Repair (Unique Match)" : "Select Target File"}
                </span>

                {issue.candidates.length === 1 ? (
                  <p className="font-mono text-[11px] text-teal-900 dark:text-teal-200 break-all er-long-text">
                    {issue.suggestedTarget}
                  </p>
                ) : (
                  <div className="space-y-1">
                    <label htmlFor="candidateSelect" className="text-[11px] text-teal-800 dark:text-teal-300 block">
                      Choose one of the existing candidates:
                    </label>
                    <select
                      id="candidateSelect"
                      value={customTarget || issue.candidates[0]}
                      onChange={(e) => setCustomTarget(e.target.value)}
                      className="w-full text-xs font-mono p-2 border border-teal-300 dark:border-teal-700 rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                  <p className="text-[11px] text-teal-700 dark:text-teal-300 pt-1 border-t border-teal-100 dark:border-teal-900/50">
                    <strong>Reason:</strong> {issue.reason}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px]">
                No matching candidate file found in this archive. This link will be preserved unchanged unless you choose to skip it.
              </div>
            )}
          </div>

          {/* Helpful Next Action (Section 3.1) */}
          {(() => {
            const nextAction = getHelpfulNextAction(issue);
            return (
              <div className="p-3.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Helpful Next Action: {nextAction.title}</span>
                </div>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {nextAction.detail}
                </p>
                <div className="pt-1 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Recommended documentation:</span>
                  <Link
                    href={nextAction.guideHref}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:underline"
                  >
                    <span>{nextAction.guideTitle}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Drawer Action Footer (Touch-sized min-h-[44px] buttons) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 space-y-2 shrink-0">
          {selectedTarget ? (
            <button
              type="button"
              onClick={() => onApprove(issue.id, selectedTarget)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Link Repair</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSkip(issue.id)}
              className="flex-1 min-h-[44px] py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
