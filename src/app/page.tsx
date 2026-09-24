import Link from "next/link";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 md:py-24">
        <div className="container-public text-center max-w-3xl">
          {/* Privacy badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Your archive is processed on this device</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Check your export. Review the fixes. Download a cleaner copy.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            Fix broken relative links and missing image paths in your Notion Markdown &amp; CSV export before importing into Obsidian or other note tools.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/check"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-colors"
            >
              Check my export
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/check?sample=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-base transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Try a sample
            </Link>
          </div>
        </div>
      </section>

      {/* Scope Strip */}
      <section className="container-public">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Notion Markdown &amp; CSV</h3>
              <p className="text-xs text-slate-500">Supports standard ZIP exports</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Works without an account</h3>
              <p className="text-xs text-slate-500">Zero mandatory sign-up</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Original stays unchanged</h3>
              <p className="text-xs text-slate-500">Creates a clean, verified copy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Report Preview */}
      <section className="container-public">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 mb-2">
                <span>Demo Data — Synthetic Sample Report</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Sample Link Inspection &amp; Proposed Fix</h2>
            </div>
            <Link
              href="/check?sample=true"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Open Interactive Demo
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">Broken Target (Original)</span>
                <p className="font-mono text-sm text-slate-800 mt-1 truncate">
                  [Sprint Planning](Sprint%20Planning.md)
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  File is missing in the parent directory because Notion exported it into a subfolder.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">Proposed Safe Repair</span>
                <p className="font-mono text-sm text-teal-900 mt-1 truncate">
                  [Sprint Planning](Meeting%20Notes/Sprint%20Planning%207f102a.md)
                </p>
                <p className="text-xs text-teal-700 mt-2">
                  Matched unique file in archive using export ID and note title.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Requires user approval before any changes are written.
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container-public">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <p className="text-sm text-slate-600 mt-2">Simple, transparent 4-step repair process</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-base">Choose ZIP file</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your Notion Markdown &amp; CSV export. The file stays completely on your computer.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-base">Scan references</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Finds broken relative note links, missing image references, and casing mismatches.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-base">Review fixes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approve suggested destination edits one-by-one or in batch. You have full control.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-slate-900 text-base">Download clean ZIP</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get your updated notes plus comprehensive audit reports (HTML, JSON, change logs).
            </p>
          </div>
        </div>
      </section>

      {/* What it checks and what results mean */}
      <section className="container-public">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">What it checks</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Markdown links:</strong> Identifies broken relative paths between exported notes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Local image references:</strong> Verifies embedded diagrams and attachments exist.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Path portability:</strong> Flags deeply nested folder paths that may fail on Windows extractions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Unchecked content:</strong> Clearly notes when CSV files or raw HTML blocks are skipped.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">What results mean</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Can review a fix:</strong> A unique candidate file was found in the archive ready for your approval.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Needs manual attention:</strong> Ambiguous matches (multiple candidates) or missing files that cannot be recreated.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong>Not checked:</strong> Remote external web links (http/https) and CSV cell contents are deliberately untouched.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-public">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Does my export file get uploaded to your servers?
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              No. Processing happens 100% inside your browser using Web Workers and JavaScript. Your notes, images, and file paths never leave your device.
            </p>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Can you restore missing images or deleted files?
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              We can flag missing files, but cannot recreate them. If a file was not included in your Notion export, it must be exported again from Notion.
            </p>
          </div>

          <div className="p-6">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Will my original ZIP file be modified?
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              No. Browsers cannot modify your local original file directly. We create a completely new, clean ZIP file for you to download.
            </p>
          </div>
        </div>
      </section>

      {/* Final Action Callout */}
      <section className="container-public">
        <div className="bg-indigo-600 text-white rounded-2xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Ready to inspect your export?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-sm md:text-base">
            No account required. Process your Notion archive securely right now on your machine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/check"
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Check my export
            </Link>
            <Link
              href="/guides"
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-colors"
            >
              Read Notion Export Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
