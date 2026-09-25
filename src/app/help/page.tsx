import Link from "next/link";
import { HelpCircle, ChevronRight, ShieldCheck, Mail } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "What types of exports are supported?",
      a: "Currently, the engine supports Notion's standard 'Markdown & CSV' ZIP archives. We inspect Markdown (.md) notes, image attachments (.png, .jpg, .svg, etc.), and list CSV database files in the inventory.",
    },
    {
      q: "Are password-protected or multi-part ZIPs supported?",
      a: "No. Encrypted ZIP archives and split multi-volume files (.z01, .z02) are rejected for security and deterministic integrity verification.",
    },
    {
      q: "What are the file size limits?",
      a: "Archives up to 50 MiB compressed (150 MiB uncompressed) and up to 2,500 files are supported directly in the browser worker memory.",
    },
    {
      q: "Why do some links say 'Unchecked'?",
      a: "Links pointing to external websites (http/https), heading fragment anchors (#heading), and URLs inside CSV spreadsheet cells are not modified to prevent unintended side effects.",
    },
    {
      q: "What happens if I refresh the page during a scan?",
      a: "Because all files are processed securely in your browser's temporary memory, refreshing or closing the browser tab clears the session. You will simply need to choose the ZIP file again.",
    },
    {
      q: "Do I need to create an account to download my repaired export?",
      a: "No! The tool is completely free and requires zero login. An optional account is provided only if you wish to store a record of your summary counts (e.g. number of files and issues resolved) for auditing.",
    },
  ];

  return (
    <div className="container-public py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help &amp; Troubleshooting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Help Center &amp; Common Questions
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
          Find answers regarding archive compatibility, troubleshooting scan errors, and export limitations.
        </p>
      </div>

      {/* FAQs List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 shadow-sm overflow-hidden transition-colors">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6 space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Support card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Still having trouble with your export?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Check out our step-by-step guides or try the synthetic sample demo in the workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/guides"
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors border border-transparent dark:border-slate-700"
          >
            View Guides
          </Link>
          <Link
            href="/check?sample=true"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
