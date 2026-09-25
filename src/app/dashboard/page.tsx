"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface SavedSummaryItem {
  id: string;
  title: string;
  date: string;
  resultKind: "repaired" | "checked_copy" | "scan_only";
  fileCount: number;
  issueCountBefore: number;
  appliedChangeCount: number;
  uncheckedFileCount: number;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<SavedSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch reports from API on load
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports?limit=50");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved summary record?")) return;

    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setStatusMessage("Summary record deleted.");
        setTimeout(() => setStatusMessage(null), 2500);
      } else {
        alert("Could not delete report.");
      }
    } catch {
      alert("Error contacting server.");
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    return r.resultKind === filter;
  });

  return (
    <div className="container-public py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Saved Scan Summaries</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit history of your past export scans. Your original files and notes are never stored on the server.
          </p>
        </div>
        <Link
          href="/check"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs self-start sm:self-auto transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Check another export</span>
        </Link>
      </div>

      {statusMessage && (
        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-xs font-medium">
          {statusMessage}
        </div>
      )}

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Filter by result:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Summaries ({reports.length})</option>
            <option value="repaired">Repaired Copies</option>
            <option value="scan_only">Scan Only</option>
            <option value="checked_copy">Checked Copies</option>
          </select>
        </div>

        <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>This dashboard stores audit numbers only, not archives or notes.</span>
        </div>
      </div>

      {/* Reports Table / List */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
          Loading saved summaries...
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No summaries found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {reports.length === 0
              ? "You haven't saved any scan summaries yet. Run a check on an export and click 'Save scan summary'."
              : "No reports match the selected filter."}
          </p>
          <div className="pt-2">
            <Link
              href="/check"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Start New Check
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Mobile Cards View */}
          <div className="sm:hidden space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{report.title}</span>
                  </div>
                  <div>
                    {report.resultKind === "repaired" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Repaired
                      </span>
                    )}
                    {report.resultKind === "scan_only" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Scan Only
                      </span>
                    )}
                    {report.resultKind === "checked_copy" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        Checked
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-center font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Files</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{report.fileCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-sans uppercase">Issues</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">{report.issueCountBefore}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-700 dark:text-teal-400 block font-sans uppercase">Repairs</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{report.appliedChangeCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">{report.date}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(report.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete summary"
                      aria-label="Delete summary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Report Title</th>
                    <th className="py-3 px-4">Date Saved</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Files</th>
                    <th className="py-3 px-4 text-center">Issues</th>
                    <th className="py-3 px-4 text-center">Repairs</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>{report.title}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="py-3 px-4">
                        {report.resultKind === "repaired" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Repaired
                          </span>
                        )}
                        {report.resultKind === "scan_only" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Scan Only
                          </span>
                        )}
                        {report.resultKind === "checked_copy" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            Checked
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-800 dark:text-slate-200">{report.fileCount}</td>
                      <td className="py-3 px-4 text-center font-mono text-amber-700 dark:text-amber-400 font-medium">
                        {report.issueCountBefore}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-teal-700 dark:text-teal-400 font-medium">
                        {report.appliedChangeCount}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px] transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(report.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete summary"
                          aria-label="Delete summary"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
