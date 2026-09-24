"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArchiveEntry,
  IssueItem,
  ScanCoverage,
  WorkspaceSummary,
  WorkspaceStep,
  ApprovedChange,
} from "@/lib/types/workspace";
import {
  SAMPLE_ARCHIVE_NAME,
  SAMPLE_ARCHIVE_SIZE,
  SAMPLE_FILES,
  SAMPLE_ISSUES,
  SAMPLE_COVERAGE,
  SAMPLE_SUMMARY,
} from "@/lib/fixtures/sampleExport";
import StepIndicator from "@/components/workspace/StepIndicator";
import FileTree from "@/components/workspace/FileTree";
import IssueDrawer from "@/components/workspace/IssueDrawer";
import SaveSummaryModal from "@/components/workspace/SaveSummaryModal";
import {
  Upload,
  FileArchive,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Download,
  FileText,
  FileCode,
  RotateCcw,
  Check,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";

function WorkspaceContent() {
  const searchParams = useSearchParams();

  // State machine step
  const [step, setStep] = useState<WorkspaceStep>("choose");

  // File state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Scanning progress state
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState("");

  // Building progress state
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStageText, setBuildStageText] = useState("");

  // Review & Repair state
  const [activeTab, setActiveTab] = useState<"issues" | "files" | "plan">("issues");
  const [files, setFiles] = useState<ArchiveEntry[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [coverage, setCoverage] = useState<ScanCoverage | null>(null);
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [approvedChanges, setApprovedChanges] = useState<ApprovedChange[]>([]);

  // Selected issue for drawer
  const [drawerIssue, setDrawerIssue] = useState<IssueItem | null>(null);

  // Filters for issue table
  const [issueCategoryFilter, setIssueCategoryFilter] = useState<string>("all");
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<string>("all");
  const [issueSearch, setIssueSearch] = useState<string>("");

  // Save summary modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [summarySavedNotice, setSummarySavedNotice] = useState(false);

  // Check if sample param is passed on load
  useEffect(() => {
    if (searchParams.get("sample") === "true") {
      loadSampleData();
    }
  }, [searchParams]);

  // Load demo synthetic dataset
  const loadSampleData = () => {
    setSelectedFile({
      name: SAMPLE_ARCHIVE_NAME,
      size: SAMPLE_ARCHIVE_SIZE,
    });
    setIsDemoMode(true);
  };

  // Handle local file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: file.size,
      });
      setIsDemoMode(false);
    }
  };

  // Remove chosen file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsDemoMode(false);
    setStep("choose");
  };

  // Step 1 -> Step 2: Start scan simulation / execution
  const handleStartScan = () => {
    if (!selectedFile) return;
    setStep("scanning");
    setScanProgress(10);
    setScanStageText("Validating ZIP archive structure and limits...");

    setTimeout(() => {
      setScanProgress(40);
      setScanStageText("Reading Markdown notes and extracting references (5 notes)...");
    }, 600);

    setTimeout(() => {
      setScanProgress(75);
      setScanStageText("Checking local paths, image destinations, and casing (14 references)...");
    }, 1200);

    setTimeout(() => {
      setScanProgress(100);
      setScanStageText("Preparing diagnostic report and candidate matches...");

      // Populate review state with sample or parsed data
      setFiles(SAMPLE_FILES);
      setIssues(SAMPLE_ISSUES);
      setCoverage(SAMPLE_COVERAGE);
      setSummary(SAMPLE_SUMMARY);
      setApprovedChanges([]);

      setTimeout(() => {
        setStep("review");
      }, 400);
    }, 1800);
  };

  // Cancel in-flight scan
  const handleCancelScan = () => {
    setStep("choose");
    setScanProgress(0);
    setScanStageText("");
  };

  // Approve a single issue change
  const handleApproveIssue = (issueId: string, target?: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return { ...iss, status: "approved" as const, suggestedTarget: target || iss.suggestedTarget };
        }
        return iss;
      })
    );

    const issue = issues.find((i) => i.id === issueId);
    if (issue) {
      const newTarget = target || issue.suggestedTarget || "";
      setApprovedChanges((prev) => [
        ...prev.filter((c) => c.issueId !== issueId),
        {
          issueId,
          sourceFile: issue.sourceFile,
          oldTarget: issue.originalTarget,
          newTarget,
          reason: issue.reason || "Approved by user",
        },
      ]);
    }
    setDrawerIssue(null);
  };

  // Skip a single issue
  const handleSkipIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: "skipped" as const } : iss))
    );
    setApprovedChanges((prev) => prev.filter((c) => c.issueId !== issueId));
    setDrawerIssue(null);
  };

  // Batch select all eligible non-ambiguous suggestions
  const handleSelectAllEligible = () => {
    const eligible = issues.filter(
      (iss) =>
        (iss.category === "broken_note_link" || iss.category === "case_mismatch") &&
        iss.suggestedTarget &&
        (!iss.candidates || iss.candidates.length === 1)
    );

    setIssues((prev) =>
      prev.map((iss) => {
        if (eligible.some((e) => e.id === iss.id)) {
          return { ...iss, status: "approved" as const };
        }
        return iss;
      })
    );

    const newChanges: ApprovedChange[] = eligible.map((iss) => ({
      issueId: iss.id,
      sourceFile: iss.sourceFile,
      oldTarget: iss.originalTarget,
      newTarget: iss.suggestedTarget!,
      reason: iss.reason || "Unique candidate match",
    }));

    setApprovedChanges(newChanges);
  };

  // Step 3 -> Step 4: Build clean copy
  const handleStartBuild = () => {
    setStep("building");
    setBuildProgress(15);
    setBuildStageText("Applying approved link destination patches...");

    setTimeout(() => {
      setBuildProgress(50);
      setBuildStageText("Rechecking modified Markdown documents...");
    }, 600);

    setTimeout(() => {
      setBuildProgress(80);
      setBuildStageText("Validating checksums on all untouched files...");
    }, 1200);

    setTimeout(() => {
      setBuildProgress(100);
      setBuildStageText("Generating audit reports and packaging new ZIP archive...");

      setTimeout(() => {
        if (summary) {
          setSummary({
            ...summary,
            resultKind: approvedChanges.length > 0 ? "repaired" : "checked_copy",
            issueCountAfter: Math.max(0, summary.issueCountBefore - approvedChanges.length),
            appliedChangeCount: approvedChanges.length,
          });
        }
        setStep("download");
      }, 500);
    }, 1800);
  };

  // Download handlers
  const handleDownloadZip = () => {
    // Generates a mock download for the demo
    const blob = new Blob(["Simulated Repaired Notion Export ZIP content"], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `repaired_${selectedFile?.name || "export.zip"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReportJson = () => {
    const reportData = {
      engineVersion: "1.0.0",
      date: new Date().toISOString(),
      archiveName: selectedFile?.name,
      summary,
      coverage,
      approvedChanges,
      issues,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export_repair_report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReportHtml = () => {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Export Repair Audit Report</title></head>
<body style="font-family:sans-serif;padding:2rem;">
<h1>Export Repair Audit Report</h1>
<p>Archive: ${selectedFile?.name}</p>
<p>Applied Changes: ${approvedChanges.length}</p>
<p>All untouched files verified byte-for-byte.</p>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export_repair_report.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered issues for review table
  const filteredIssues = issues.filter((iss) => {
    const matchesCategory = issueCategoryFilter === "all" ? true : iss.category === issueCategoryFilter;
    const matchesSeverity = issueSeverityFilter === "all" ? true : iss.severity === issueSeverityFilter;
    const matchesSearch =
      iss.sourceFile.toLowerCase().includes(issueSearch.toLowerCase()) ||
      iss.explanation.toLowerCase().includes(issueSearch.toLowerCase()) ||
      iss.originalTarget.toLowerCase().includes(issueSearch.toLowerCase());
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  return (
    <div className="container-workspace py-8 space-y-8">
      {/* Demo Data Banner if in demo mode */}
      {isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Demo Data Active:</strong> Using synthetic sample archive for interactive demonstration.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-amber-800 underline font-semibold hover:text-amber-950"
          >
            Clear Demo
          </button>
        </div>
      )}

      {/* Step Indicator */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <StepIndicator
          currentStep={step}
          onStepClick={(targetStep) => {
            if (targetStep === "choose") setStep("choose");
            else if (targetStep === "review" && issues.length > 0) setStep("review");
          }}
        />
      </div>

      {/* ========================================================
          STEP 1: CHOOSE FILE
         ======================================================== */}
      {step === "choose" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Check your Notion export
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Select your Notion ZIP archive. Your files are processed entirely inside your browser.{" "}
              <Link href="/guides/notion-export" className="text-indigo-600 hover:underline">
                View export guide
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Format tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-slate-100">
              <span className="text-slate-500">
                Source Format: <strong className="text-slate-800">Notion — Markdown &amp; CSV</strong>
              </span>
              <span className="text-slate-500">
                Target Output: <strong className="text-teal-700">Portable Markdown ZIP</strong>
              </span>
            </div>

            {/* Dropzone area */}
            {!selectedFile ? (
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-8 sm:p-12 text-center space-y-4 bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Choose Notion export ZIP file"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drop your Notion ZIP here
                  </p>
                  <p className="text-xs text-slate-500">Maximum recommended archive size: 50 MiB</p>
                </div>
              </div>
            ) : (
              /* Chosen File Card */
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Stored only in local browser memory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Privacy and limits notice */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Your archive is processed on this device. No files are uploaded to the cloud.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>We can flag missing files, but cannot recreate deleted content.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                disabled={!selectedFile}
                onClick={handleStartScan}
                className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Start check</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={loadSampleData}
                className="w-full sm:w-auto py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Try a sample</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 2: SCAN PROGRESS
         ======================================================== */}
      {step === "scanning" && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Scanning archive...</h2>
            <p className="text-xs text-slate-500">Analyzing internal paths, links, and attachments</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{scanStageText}</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleCancelScan}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
              >
                Cancel Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 3: REVIEW & REPAIR PLAN
         ======================================================== */}
      {step === "review" && (
        <div className="space-y-6">
          {/* Top Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Archive Files</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">{files.length}</span>
              <span className="text-[11px] text-slate-400">Notes, images &amp; CSVs</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Links Checked</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">
                {coverage?.checkedReferences || 14}
              </span>
              <span className="text-[11px] text-slate-400">Markdown targets</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-amber-700 block uppercase">Issues Found</span>
              <span className="text-2xl font-bold text-amber-800 mt-1 block font-mono">{issues.length}</span>
              <span className="text-[11px] text-amber-600">Broken or ambiguous</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-teal-700 block uppercase">Approved Fixes</span>
              <span className="text-2xl font-bold text-teal-800 mt-1 block font-mono">{approvedChanges.length}</span>
              <span className="text-[11px] text-teal-600">Ready to rebuild</span>
            </div>
          </div>

          {/* Coverage Banner */}
          {coverage && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">Scan Coverage:</span>{" "}
                <span>
                  {coverage.checkedMarkdownNotes} Markdown notes checked. Links inside CSV and raw HTML tables are preserved as text without modification.
                </span>
              </div>
              <span className="inline-flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Local
              </span>
            </div>
          )}

          {/* Main review workspace layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left panel: File Tree */}
            <div className="lg:col-span-4">
              <FileTree
                files={files}
                onSelectFile={(file) => {
                  setIssueSearch(file.name);
                }}
              />
            </div>

            {/* Right main panel: Tabs (Issues, Inventory, Repair Plan) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Tab headers */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("issues")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === "issues"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Issues ({issues.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("plan")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      activeTab === "plan"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>Repair Plan</span>
                    <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-[10px]">
                      {approvedChanges.length}
                    </span>
                  </button>
                </div>

                {activeTab === "issues" && (
                  <button
                    type="button"
                    onClick={handleSelectAllEligible}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Select All Safe Suggestions
                  </button>
                )}
              </div>

              {/* Tab 1: Issues View */}
              {activeTab === "issues" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                  {/* Filters row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs pb-3 border-b border-slate-100">
                    <div className="flex-1 min-w-[160px] relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search issue or note..."
                        value={issueSearch}
                        onChange={(e) => setIssueSearch(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      />
                    </div>

                    <select
                      value={issueCategoryFilter}
                      onChange={(e) => setIssueCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="broken_note_link">Broken Note Link</option>
                      <option value="case_mismatch">Case Mismatch</option>
                      <option value="missing_image">Missing Image</option>
                      <option value="ambiguous_target">Ambiguous Target</option>
                      <option value="long_path">Long Path</option>
                      <option value="unchecked_content">Unchecked Content</option>
                    </select>

                    <select
                      value={issueSeverityFilter}
                      onChange={(e) => setIssueSeverityFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                    >
                      <option value="all">All Severities</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>

                  {/* Issues List / Table */}
                  <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                    {filteredIssues.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        No issues match your current filters.
                      </div>
                    ) : (
                      filteredIssues.map((issue) => {
                        const isApproved = issue.status === "approved";
                        return (
                          <div
                            key={issue.id}
                            className={`p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                              isApproved ? "bg-teal-50/50" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    issue.severity === "error"
                                      ? "bg-red-100 text-red-800"
                                      : issue.severity === "warning"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {issue.category.replace(/_/g, " ")}
                                </span>
                                <span className="font-mono text-[11px] text-slate-500 truncate" title={issue.sourceFile}>
                                  {issue.sourceFile}
                                </span>
                              </div>
                              <p className="text-slate-800 font-medium">{issue.explanation}</p>
                              <div className="text-[11px] font-mono text-slate-500">
                                Target: <span className="text-red-700">{issue.originalTarget}</span>
                                {issue.suggestedTarget && (
                                  <>
                                    {" "}
                                    &rarr; <span className="text-teal-700">{issue.suggestedTarget}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-full">
                                  <Check className="w-3.5 h-3.5" />
                                  Approved
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDrawerIssue(issue)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Repair Plan */}
              {activeTab === "plan" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Approved Repairs Plan</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        These destination replacements will be safely patched into the new copy.
                      </p>
                    </div>
                    {approvedChanges.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setApprovedChanges([]);
                          setIssues((prev) => prev.map((i) => ({ ...i, status: "pending" as const })));
                        }}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {approvedChanges.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                      <p>No link changes approved yet.</p>
                      <p className="text-slate-400">
                        Review the issues list and click &ldquo;Approve Link Repair&rdquo; or &ldquo;Select All Safe Suggestions&rdquo;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {approvedChanges.map((change, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
                            <span className="truncate">{change.sourceFile}</span>
                            <span className="text-teal-700 font-semibold shrink-0">{change.reason}</span>
                          </div>
                          <div className="font-mono text-[11px] flex items-center gap-2">
                            <span className="text-red-700 truncate">{change.oldTarget}</span>
                            <span>&rarr;</span>
                            <span className="text-teal-700 font-bold truncate">{change.newTarget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Build button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Original archive remains 100% untouched.
                    </span>
                    <button
                      type="button"
                      onClick={handleStartBuild}
                      className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Build Verified Copy</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Quick Bar */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{approvedChanges.length} of {issues.length} issues approved for repair.</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    Save Scan Summary
                  </button>
                  <button
                    type="button"
                    onClick={handleStartBuild}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors"
                  >
                    Proceed to Build &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 4: BUILD PROGRESS
         ======================================================== */}
      {step === "building" && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Building verified copy...</h2>
            <p className="text-xs text-slate-500">
              Applying approved link changes and checking file checksums
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{buildStageText}</span>
                <span>{buildProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              Preserving original untouched file bytes using checksum validation.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          STEP 5: DOWNLOAD
         ======================================================== */}
      {step === "download" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6 text-center">
            {/* Outcome icon */}
            <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {approvedChanges.length > 0 ? "Repaired copy ready" : "Checked copy ready"}
              </h2>
              <p className="text-xs text-slate-500">
                {approvedChanges.length > 0
                  ? `Successfully repaired ${approvedChanges.length} internal links. Checksums verified.`
                  : "All checked internal links were already resolved. Verified audit report attached."}
              </p>
            </div>

            {/* Before / After Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Files</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{files.length}</span>
              </div>
              <div>
                <span className="text-[11px] text-teal-700 block">Changes Applied</span>
                <span className="text-lg font-bold text-teal-800 font-mono">{approvedChanges.length}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Remaining Issues</span>
                <span className="text-lg font-bold text-slate-700 font-mono">
                  {Math.max(0, issues.length - approvedChanges.length)}
                </span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                className="w-full py-3.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Repaired ZIP</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReportHtml}
                  className="py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Download Report (HTML)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReportJson}
                  className="py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-4 h-4 text-teal-600" />
                  <span>Download Report (JSON)</span>
                </button>
              </div>
            </div>

            {/* Account & Session Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(true)}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Save summary counts to account
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setSelectedFile(null);
                  setIsDemoMode(false);
                }}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check another export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Details Drawer */}
      <IssueDrawer
        issue={drawerIssue}
        onClose={() => setDrawerIssue(null)}
        onApprove={handleApproveIssue}
        onSkip={handleSkipIssue}
      />

      {/* Save Summary Modal */}
      {summary && (
        <SaveSummaryModal
          summary={summary}
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirmSave={() => setSummarySavedNotice(true)}
        />
      )}
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="container-workspace py-16 text-center text-xs text-slate-500">
          Loading workspace...
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
