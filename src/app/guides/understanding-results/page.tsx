import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function UnderstandingResultsGuidePage() {
  return (
    <div className="container-public py-12 max-w-3xl space-y-8">
      {/* Back button */}
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to guides</span>
      </Link>

      {/* Guide Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Understanding Results and Repairs
        </h1>
        <p className="text-slate-500 text-xs mt-2">Last updated: September 2026 · Estimated reading time: 4 mins</p>
      </div>

      {/* Content */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. How We Classify Export Findings</h2>
          <p>
            When scanning your archive, each Markdown link and image reference is checked against the internal files in your ZIP. Findings are grouped into categories so you can quickly see what can be safely repaired and what needs your manual choice.
          </p>
        </section>

        {/* Categories breakdown */}
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-800 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Can Review a Fix (Unique Candidate)</span>
            </div>
            <p className="text-xs text-teal-900 leading-relaxed">
              The original target link is broken, but an exact unique file was identified in the archive (for example, inside a subfolder or matching Notion's exported page ID). You can approve this fix with one click.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Ambiguous Target (Multiple Candidates)</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Two or more files in different folders have the same title. The engine will never guess or use AI to choose arbitrarily; it prompts you to pick the intended file from a dropdown.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Missing Target (No Matching Copy)</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              The referenced image or note does not exist anywhere inside the selected ZIP. We flag these files clearly in the audit report so you know which items were not included in the export.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Info className="w-4 h-4" />
              <span>Unchecked &amp; Portability Notices</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              External web URLs (e.g. <code>https://...</code>), CSV cells, and files with paths exceeding 120 characters are reported transparently. They are preserved intact without modifying their contents.
            </p>
          </div>
        </div>

        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-slate-900">2. Verification Before Downloading</h2>
          <p>
            When you click &ldquo;Build Repaired Copy&rdquo;, our engine creates a fresh ZIP. It reapplies approved link changes, recalculates internal checksums, verifies all unchanged notes match byte-for-byte, and attaches a complete HTML/JSON audit report.
          </p>
        </section>
      </div>
    </div>
  );
}
