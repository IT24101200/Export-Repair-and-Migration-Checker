"use client";

import { useState } from "react";
import { MessageSquare, Check, AlertCircle, Send, ShieldCheck } from "lucide-react";

export default function FeedbackCard() {
  const [outcome, setOutcome] = useState<string>("helped");
  const [reasonCode, setReasonCode] = useState<string>("none");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        clientFeedbackId: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        schemaVersion: 1,
        engineVersion: "1.0.0",
        sourceFormat: "notion_markdown_csv",
        outcome,
        reasonCode,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || "Failed to submit feedback");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Error sending feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 rounded-xl p-4 text-center space-y-1.5 text-xs text-teal-800 dark:text-teal-300">
        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 mx-auto flex items-center justify-center">
          <Check className="w-4 h-4" />
        </div>
        <p className="font-semibold">Thank you for your feedback!</p>
        <p className="text-[11px] text-teal-700 dark:text-teal-300">
          Your voluntary response helps us refine export link repair rules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300 transition-colors">
      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
        <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3>How did this check and repair work for you?</h3>
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="outcomeSelect" className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Did this tool resolve your export references?
          </label>
          <select
            id="outcomeSelect"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="helped">Helped — all important links resolved</option>
            <option value="partly_helped">Partly helped — some links still broken</option>
            <option value="not_helped">Did not help</option>
            <option value="not_sure">Not sure yet</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficultySelect" className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Main difficulty (if any):
          </label>
          <select
            id="difficultySelect"
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="none">None — smooth workflow</option>
            <option value="selecting_export">Selecting correct Notion ZIP</option>
            <option value="understanding_findings">Understanding findings and categories</option>
            <option value="repair_options">Reviewing and selecting candidate targets</option>
            <option value="download">Downloading or extracting repaired ZIP</option>
            <option value="unsupported_format">Unsupported formats (e.g. CSV or HTML)</option>
            <option value="performance">Browser performance or speed</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Structured choices only. No notes sent.
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Sending..." : "Send feedback"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
