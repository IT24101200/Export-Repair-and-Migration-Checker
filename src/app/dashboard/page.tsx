"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Layers,
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
  // Sample initial records for the user's dashboard demonstration
  const [reports, setReports] = useState<SavedSummaryItem[]>([
    {
      id: "rep-001",
      title: "Report — 24 September 2026",
      date: "2026-09-24 18:30",
      resultKind: "repaired",
      fileCount: 42,
      issueCountBefore: 7,
      appliedChangeCount: 5,
      uncheckedFileCount: 2,
    },
    {
      id: "rep-002",
      title: "Report — 23 September 2026",
      date: "2026-09-23 11:15",
      resultKind: "scan_only",
      fileCount: 18,
      issueCountBefore: 3,
      appliedChangeCount: 0,
      uncheckedFileCount: 0,
    },
  ]);

  const [filter, setFilter] = useState<string>("all");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this saved summary record?")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === "all") return true;
    return r.resultKind === filter;
  });

  return (
    <div className="container-public py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Scan Summaries</h1>
          <p className="text-xs text-slate-500 mt-1">
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

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter by result:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Summaries ({reports.length})</option>
            <option value="repaired">Repaired Copies</option>
            <option value="scan_only">Scan Only</option>
            <option value="checked_copy">Checked Copies</option>
          </select>
        </div>

        <div className="p-2 rounded bg-indigo-50 text-indigo-700 text-xs border border-indigo-100 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>This dashboard stores audit numbers only, not archives or notes.</span>
        </div>
      </div>

      {/* Reports Table / List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No summaries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
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
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{report.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {report.date}
                    </td>
                    <td className="py-3 px-4">
                      {report.resultKind === "repaired" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Repaired
                        </span>
                      )}
                      {report.resultKind === "scan_only" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          Scan Only
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{report.fileCount}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-700 font-medium">
                      {report.issueCountBefore}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-teal-700 font-medium">
                      {report.appliedChangeCount}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/dashboard/reports/${report.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(report.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
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
      )}
    </div>
  );
}
