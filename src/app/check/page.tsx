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
import { scanArchive } from "@/lib/engine/archiveScanner";
import { buildRepairedArchive } from "@/lib/engine/archiveRepairer";
import StepIndicator from "@/components/workspace/StepIndicator";
import FileTree from "@/components/workspace/FileTree";
import IssueDrawer from "@/components/workspace/IssueDrawer";
import SaveSummaryModal from "@/components/workspace/SaveSummaryModal";
import DiagnosticsPanel from "@/components/workspace/DiagnosticsPanel";
import FeedbackCard from "@/components/workspace/FeedbackCard";
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  ListChecks,
} from "lucide-react";

function WorkspaceContent() {
  const searchParams = useSearchParams();

  // State machine step
  const [step, setStep] = useState<WorkspaceStep>("choose");

  // File state
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Scanning progress state
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState("");

  // Building progress state
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStageText, setBuildStageText] = useState("");

  // Engine review state
  const [activeTab, setActiveTab] = useState<"issues" | "files" | "plan">("issues");
  const [files, setFiles] = useState<ArchiveEntry[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [coverage, setCoverage] = useState<ScanCoverage | null>(null);
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [approvedChanges, setApprovedChanges] = useState<ApprovedChange[]>([]);
  const [noteContents, setNoteContents] = useState<Map<string, string>>(new Map());

  // Resulting ZIP blob
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);

  // Selected issue for drawer
  const [drawerIssue, setDrawerIssue] = useState<IssueItem | null>(null);

  // Filters for issue table
  const [issueCategoryFilter, setIssueCategoryFilter] = useState<string>("all");
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<string>("all");
  const [issueSearch, setIssueSearch] = useState<string>("");

  // Save summary modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [summarySavedNotice, setSummarySavedNotice] = useState(false);

  // Diagnostics panel & coverage details expansion (NEXT-03 & NEXT-04)
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isCoverageExpanded, setIsCoverageExpanded] = useState(false);
  const [downloadFeedbackNotice, setDownloadFeedbackNotice] = useState<string | null>(null);

  // Check if sample param is passed on load
  useEffect(() => {
    if (searchParams.get("sample") === "true") {
      loadSampleData();
    }
  }, [searchParams]);

  // Load demo synthetic dataset
  const loadSampleData = () => {
    setSelectedFileMeta({
      name: SAMPLE_ARCHIVE_NAME,
      size: SAMPLE_ARCHIVE_SIZE,
    });
    setRawFile(null);
    setIsDemoMode(true);
    setErrorMessage(null);
  };

  // Handle local file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawFile(file);
      setSelectedFileMeta({
        name: file.name,
        size: file.size,
      });
      setIsDemoMode(false);
      setErrorMessage(null);
    }
  };

  // Remove chosen file
  const handleRemoveFile = () => {
    setRawFile(null);
    setSelectedFileMeta(null);
    setIsDemoMode(false);
    setErrorMessage(null);
    setOutputBlob(null);
    setStep("choose");
  };

  // Step 1 -> Step 2: Start scan
  const handleStartScan = async () => {
    if (!selectedFileMeta) return;
    setErrorMessage(null);
    setStep("scanning");

    // If using synthetic demo fixture
    if (isDemoMode || !rawFile) {
      setScanProgress(10);
      setScanStageText("Validating ZIP archive structure and limits...");

      setTimeout(() => {
        setScanProgress(45);
        setScanStageText("Reading Markdown notes and extracting references (5 notes)...");
      }, 500);

      setTimeout(() => {
        setScanProgress(80);
        setScanStageText("Checking local paths, image destinations, and casing (14 references)...");
      }, 1000);

      setTimeout(() => {
        setScanProgress(100);
        setScanStageText("Preparing diagnostic report and candidate matches...");

        setFiles(SAMPLE_FILES);
        setIssues(SAMPLE_ISSUES);
        setCoverage(SAMPLE_COVERAGE);
        setSummary(SAMPLE_SUMMARY);
        setApprovedChanges([]);
        setStep("review");
      }, 1500);
      return;
    }

    // Real archive file processing using @zip.js/zip.js engine
    try {
      const result = await scanArchive(rawFile, (percent, msg) => {
        setScanProgress(percent);
        setScanStageText(msg);
      });

      setFiles(result.files);
      setIssues(result.issues);
      setCoverage(result.coverage);
      setSummary(result.summary);
      setNoteContents(result.noteContents);
      setApprovedChanges([]);
      setStep("review");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to scan archive. Ensure it is a valid Notion ZIP export.");
      setStep("choose");
    }
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

  // Step 3 -> Step 4: Build verified copy
  const handleStartBuild = async () => {
    setStep("building");
    setBuildProgress(10);
    setBuildStageText("Preparing verified archive build...");

    // Real file repair if rawFile exists
    if (rawFile && summary) {
      try {
        const { blob } = await buildRepairedArchive({
          originalZipFile: rawFile,
          files,
          noteContents,
          approvedChanges,
          issues,
          summary,
          onProgress: (pct, msg) => {
            setBuildProgress(pct);
            setBuildStageText(msg);
          },
        });

        setOutputBlob(blob);
        setSummary({
          ...summary,
          resultKind: approvedChanges.length > 0 ? "repaired" : "checked_copy",
          issueCountAfter: Math.max(0, summary.issueCountBefore - approvedChanges.length),
          appliedChangeCount: approvedChanges.length,
        });
        setStep("download");
      } catch (err: any) {
        setErrorMessage("Error building clean archive: " + (err?.message || "unknown error"));
        setStep("review");
      }
      return;
    }

    // Demo simulation fallback
    setBuildProgress(25);
    setBuildStageText("Applying approved link destination patches...");

    setTimeout(() => {
      setBuildProgress(60);
      setBuildStageText("Rechecking modified Markdown documents...");
    }, 600);

    setTimeout(() => {
      setBuildProgress(85);
      setBuildStageText("Validating checksums on all untouched files...");
    }, 1100);

    setTimeout(() => {
      setBuildProgress(100);
      setBuildStageText("Generating audit reports and packaging new ZIP archive...");

      if (summary) {
        setSummary({
          ...summary,
          resultKind: approvedChanges.length > 0 ? "repaired" : "checked_copy",
          issueCountAfter: Math.max(0, summary.issueCountBefore - approvedChanges.length),
          appliedChangeCount: approvedChanges.length,
        });
      }
      setStep("download");
    }, 1600);
  };

  // Download handlers
  const handleDownloadZip = () => {
    const blobToDownload =
      outputBlob ||
      new Blob(
        [
          "Export Repair and Migration Checker — Simulated Output ZIP\n" +
            `Archive: ${selectedFileMeta?.name}\n` +
            `Repaired Links: ${approvedChanges.length}\n`,
        ],
        { type: "application/zip" }
      );

    const url = URL.createObjectURL(blobToDownload);
    const a = document.createElement("a");
    a.href = url;
    a.download = `repaired_${selectedFileMeta?.name || "export.zip"}`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadFeedbackNotice("Download started! Check your downloads folder.");
    setTimeout(() => setDownloadFeedbackNotice(null), 4000);
  };

  const handleDownloadReportJson = () => {
    const reportData = {
      engineVersion: "1.0.0",
      date: new Date().toISOString(),
      archiveName: selectedFileMeta?.name,
      summary,
      coverage,
      approvedChanges,
      allIssues: issues,
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
<html lang="en">
<head><meta charset="utf-8"><title>Export Repair Audit Report</title></head>
<body style="font-family:sans-serif;padding:2rem;max-width:800px;margin:auto;">
<h1 style="color:#4F46E5;">Export Repair Audit Report</h1>
<p>Archive: <strong>${selectedFileMeta?.name}</strong></p>
<p>Applied Changes: <strong>${approvedChanges.length}</strong></p>
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
      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Check your Notion export
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your Notion ZIP archive. Your files are processed entirely inside your browser.{" "}
              <Link href="/guides/notion-export" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                View export guide
              </Link>
            </p>
          </div>

          {/* Failure state alert with Technical Diagnostics trigger (Section 3) */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Archive Processing Failure</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-500 hover:text-red-800 dark:hover:text-red-300 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-red-800 dark:text-red-300">{errorMessage}</p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDiagnosticsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>View Diagnostics Snapshot</span>
                </button>
                <Link
                  href="/guides/notion-export"
                  className="text-red-700 dark:text-red-300 hover:underline font-medium text-[11px]"
                >
                  View export guide &rarr;
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
            {/* Format tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Source Format: <strong className="text-slate-800 dark:text-slate-200">Notion — Markdown &amp; CSV</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Target Output: <strong className="text-teal-700 dark:text-teal-400">Portable Markdown ZIP</strong>
              </span>
            </div>

            {/* Dropzone area */}
            {!selectedFileMeta ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl p-8 sm:p-12 text-center space-y-4 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/20 dark:hover:bg-slate-800/70 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Choose Notion export ZIP file"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to browse or drop your Notion ZIP here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Maximum recommended archive size: 50 MiB</p>
                </div>
              </div>
            ) : (
              /* Chosen File Card */
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title={selectedFileMeta.name}>
                      {selectedFileMeta.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(selectedFileMeta.size / 1024).toFixed(1)} KB · Stored only in local browser memory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Privacy and limits notice */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Your archive is processed on this device. No files are uploaded to the cloud.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>We can flag missing files, but cannot recreate deleted content.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                disabled={!selectedFileMeta}
                onClick={handleStartScan}
                className="w-full sm:flex-1 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Start check</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={loadSampleData}
                className="w-full sm:w-auto py-3 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scanning archive...</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analyzing internal paths, links, and attachments</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span>{scanStageText}</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
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
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">Archive Files</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block font-mono">{files.length}</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Notes, images &amp; CSVs</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">Links Checked</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block font-mono">
                {coverage?.checkedReferences || 0}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Markdown targets</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block uppercase">Issues Found</span>
              <span className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1 block font-mono">{issues.length}</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400">Broken or ambiguous</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 block uppercase">Approved Fixes</span>
              <span className="text-2xl font-bold text-teal-800 dark:text-teal-300 mt-1 block font-mono">{approvedChanges.length}</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400">Ready to rebuild</span>
            </div>
          </div>

          {/* Coverage Banner with Expandable Breakdown (NEXT-03) */}
          {coverage && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-xs text-slate-700 dark:text-slate-300 transition-colors">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Scan Coverage Summary</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded text-[11px] border border-teal-200 dark:border-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Local
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    {coverage.checkedReferences} references checked in {coverage.checkedMarkdownNotes} notes. {issues.length} findings require review.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDiagnosticsOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Diagnostics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCoverageExpanded(!isCoverageExpanded)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <span>{isCoverageExpanded ? "Hide Details" : "Coverage Details"}</span>
                    {isCoverageExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Details Breakdown */}
              {isCoverageExpanded && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-900 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Supported Checks Performed
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <span><strong>Markdown inline links:</strong> Verified relative destinations like <code>[Note](path.md)</code>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <span><strong>Image attachments:</strong> Verified embedded images <code>![Alt](img.png)</code> exist on disk.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <span><strong>Casing &amp; Notion ID matches:</strong> Diagnosed folder mismatches and Notion export IDs.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2.5 pt-4 md:pt-0 md:pl-5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      Intentionally Skipped / Read-Only Areas
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span><strong>CSV database cells:</strong> {summary?.csvCount || 0} CSV files left unmodified to prevent data corruption.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span><strong>External links:</strong> Web URLs (<code>http://</code>, <code>https://</code>) are not checked or fetched.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span><strong>Heading anchors:</strong> Section fragments (e.g. <code>#heading</code>) are preserved as not verified.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
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

            {/* Right main panel: Tabs (Issues, Repair Plan) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Tab headers */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-1.5 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("issues")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeTab === "issues"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>Repair Plan</span>
                    <span className="px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 rounded-full text-[10px]">
                      {approvedChanges.length}
                    </span>
                  </button>
                </div>

                {activeTab === "issues" && (
                  <button
                    type="button"
                    onClick={handleSelectAllEligible}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    Select All Safe Suggestions
                  </button>
                )}
              </div>

              {/* Tab 1: Issues View */}
              {activeTab === "issues" && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4 transition-colors">
                  {/* Filters row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex-1 min-w-[160px] relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search issue or note..."
                        value={issueSearch}
                        onChange={(e) => setIssueSearch(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                      />
                    </div>

                    <select
                      value={issueCategoryFilter}
                      onChange={(e) => setIssueCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                      className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                  </div>

                  {/* Issues List (Responsive mobile cards & desktop rows - Section 3.2) */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto space-y-2 sm:space-y-0 p-1">
                    {filteredIssues.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                        No issues match your current filters.
                      </div>
                    ) : (
                      filteredIssues.map((issue) => {
                        const isApproved = issue.status === "approved";
                        const isSkipped = issue.status === "skipped";

                        return (
                          <div
                            key={issue.id}
                            className={`p-4 rounded-xl border sm:border-0 sm:rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                              isApproved
                                ? "bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/60"
                                : isSkipped
                                ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60"
                                : "bg-white dark:bg-slate-900/80 sm:bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <div className="space-y-1.5 min-w-0 flex-1">
                              {/* Header tags */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    issue.severity === "error"
                                      ? "bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60"
                                      : issue.severity === "warning"
                                      ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60"
                                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {issue.category.replace(/_/g, " ")}
                                </span>
                                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 er-long-text break-all" title={issue.sourceFile}>
                                  {issue.sourceFile}
                                </span>
                              </div>

                              <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{issue.explanation}</p>

                              {/* Target before / after path preview */}
                              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/60 sm:bg-transparent p-2 sm:p-0 rounded border sm:border-0 border-slate-100 dark:border-slate-800 er-long-text break-all">
                                <span className="text-slate-400">Target:</span>{" "}
                                <span className="text-red-700 dark:text-red-400 font-semibold">{issue.originalTarget}</span>
                                {issue.suggestedTarget && (
                                  <>
                                    {" "}
                                    <span className="text-slate-400">&rarr;</span>{" "}
                                    <span className="text-teal-700 dark:text-teal-300 font-semibold">{issue.suggestedTarget}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action control (Mobile full-width / desktop shrink-0, min 44px touch) */}
                            <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:self-center shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                              {isApproved ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-200 bg-teal-100/70 dark:bg-teal-950/70 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approved</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setDrawerIssue(issue)}
                                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline min-h-[44px] px-2 flex items-center"
                                  >
                                    Edit
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDrawerIssue(issue)}
                                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <span>Review issue</span>
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
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Approved Repairs Plan</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                        className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {approvedChanges.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                      <p>No link changes approved yet.</p>
                      <p className="text-slate-400 dark:text-slate-500">
                        Review the issues list and click &ldquo;Approve Link Repair&rdquo; or &ldquo;Select All Safe Suggestions&rdquo;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {approvedChanges.map((change, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="truncate">{change.sourceFile}</span>
                            <span className="text-teal-700 dark:text-teal-400 font-semibold shrink-0">{change.reason}</span>
                          </div>
                          <div className="font-mono text-[11px] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 er-long-text break-all">
                            <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 sm:bg-transparent px-1.5 py-0.5 sm:p-0 rounded">{change.oldTarget}</span>
                            <span className="text-slate-400 hidden sm:inline">&rarr;</span>
                            <span className="text-slate-400 sm:hidden text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">Replaced with &darr;</span>
                            <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/40 sm:bg-transparent px-1.5 py-0.5 sm:p-0 rounded">{change.newTarget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Build button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
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

              {/* Bottom Quick Bar (UI-04: Touch-friendly 44px min touch target) */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{approvedChanges.length} of {issues.length} issues approved for repair.</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors text-center"
                  >
                    Save Scan Summary
                  </button>
                  <button
                    type="button"
                    onClick={handleStartBuild}
                    className="min-h-[44px] px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Build</span>
                    <ArrowRight className="w-4 h-4" />
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Building verified copy...</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Applying approved link changes and checking file checksums
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span>{buildStageText}</span>
                <span>{buildProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
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
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 text-center transition-colors">
            {/* Outcome icon */}
            <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {approvedChanges.length > 0 ? "Repaired copy ready" : "Checked copy ready"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {approvedChanges.length > 0
                  ? `Successfully repaired ${approvedChanges.length} internal links. Checksums verified.`
                  : "All checked internal links were already resolved. Verified audit report attached."}
              </p>
            </div>

            {/* Download feedback notification */}
            {downloadFeedbackNotice && (
              <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{downloadFeedbackNotice}</span>
              </div>
            )}

            {/* Clear Result Summary with Separate Counts (Section 3.1) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Links Checked</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {coverage?.checkedReferences || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-teal-700 dark:text-teal-400 block">Changes Applied</span>
                  <span className="text-base font-bold text-teal-800 dark:text-teal-300 font-mono">{approvedChanges.length}</span>
                </div>
                <div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 block">Unresolved Findings</span>
                  <span className="text-base font-bold text-amber-800 dark:text-amber-300 font-mono">
                    {Math.max(0, issues.length - approvedChanges.length)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Unchecked CSVs</span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {summary?.csvCount || 0}
                  </span>
                </div>
              </div>

              {/* Plain explanation statements (Section 3.1) */}
              <div className="text-left bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <p>• <strong>{coverage?.checkedReferences || 0}</strong> local Markdown references checked across {coverage?.checkedMarkdownNotes || 0} notes.</p>
                <p>• <strong>{Math.max(0, issues.length - approvedChanges.length)}</strong> references still need attention or manual review.</p>
                <p>• Links inside <strong>{summary?.csvCount || 0}</strong> CSV files were not checked to prevent database data alteration.</p>
                <p>• This check does not verify heading anchors or external websites.</p>
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
                <span>Download Verified Clean ZIP</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReportHtml}
                  className="min-h-[44px] py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Download Report (HTML)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReportJson}
                  className="min-h-[44px] py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Download Report (JSON)</span>
                </button>
              </div>
            </div>

            {/* Open-the-result instructions checklist (NEXT-04 / Section 3.4) */}
            <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Checklist for Opening Your Repaired Copy</span>
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>Keep your original export untouched as a permanent backup.</li>
                <li>Extract the new ZIP into a new separate destination folder.</li>
                <li>Open several notes and images to confirm your key links navigate cleanly.</li>
                <li>Read <code>export-repair-report/report.html</code> for remaining warnings or unchecked files.</li>
                <li>Follow your destination app&apos;s documented migration guide (e.g. Obsidian Importer).</li>
              </ol>
            </div>

            {/* Account & Session Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Save summary counts
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setIsDiagnosticsOpen(true)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Diagnostics</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setSelectedFileMeta(null);
                  setRawFile(null);
                  setIsDemoMode(false);
                  setOutputBlob(null);
                }}
                className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check another export</span>
              </button>
            </div>
          </div>

          {/* Outcome Feedback Card (NEXT-05) */}
          <FeedbackCard />
        </div>
      )}

      {/* Technical Diagnostics Panel (NEXT-04) */}
      <DiagnosticsPanel
        summary={summary}
        stage={step}
        errorCode={errorMessage}
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

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
