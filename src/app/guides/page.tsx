import Link from "next/link";
import { BookOpen, FileText, ArrowRight, ShieldCheck, CheckCircle2, Link2, Image as ImageIcon, FolderTree, CheckSquare } from "lucide-react";

export const metadata = {
  title: "Export & Migration Guides — Export Repair Checker",
  description: "Comprehensive guides on Notion exports, fixing broken links, missing images, path limits, and migration checklists.",
};

export default function GuidesPage() {
  const guides = [
    {
      href: "/guides/notion-export",
      icon: FileText,
      iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 group-hover:bg-indigo-600 group-hover:text-white",
      title: "How to Export from Notion for Migration",
      desc: "Step-by-step instructions on exporting Notion workspaces to Markdown & CSV with subpages, handling attachments, and selecting the correct export settings.",
    },
    {
      href: "/guides/understanding-results",
      icon: CheckCircle2,
      iconColor: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 group-hover:bg-teal-600 group-hover:text-white",
      title: "Understanding Scan Results and Repairs",
      desc: "Learn what each finding category means, how unique candidate suggestions are calculated, and what requires manual attention before downloading.",
    },
    {
      href: "/guides/notion-export-broken-links",
      icon: Link2,
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 group-hover:bg-blue-600 group-hover:text-white",
      title: "Why Notion Exports Break Internal Links",
      desc: "An in-depth explanation of Notion 32-character ID suffixes, URL-encoding mismatches, relative link breaks, and how our tool suggests safe repairs.",
    },
    {
      href: "/guides/notion-export-missing-images",
      icon: ImageIcon,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 group-hover:bg-amber-600 group-hover:text-white",
      title: "Missing Images: Wrong Path vs Missing File",
      desc: "How to tell if an image in your export is simply mislinked into an asset subfolder or was completely excluded during export from Notion.",
    },
    {
      href: "/guides/notion-export-long-paths",
      icon: FolderTree,
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 group-hover:bg-purple-600 group-hover:text-white",
      title: "Handling Long File Paths & Extraction Warnings",
      desc: "Why Windows 260 MAX_PATH limits fail with nested Notion databases, and practical extraction strategies to prevent file loss.",
    },
    {
      href: "/guides/check-notion-export-before-moving",
      icon: CheckSquare,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 group-hover:bg-emerald-600 group-hover:text-white",
      title: "Pre-Migration Checklist: Check Before Moving",
      desc: "A practical 5-step checklist for preserving original archives, spot-checking repaired notes, and preparing files for Obsidian or Markdown apps.",
    },
  ];

  return (
    <div className="container-public py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation &amp; Guides</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Export &amp; Migration Guides
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
          Learn how Notion exports files, why links break during migration, and how our tool inspects and fixes broken paths while keeping your data private.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.href}
              href={g.href}
              className="group flex flex-col justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${g.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {g.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {g.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Helpful Banner */}
      <div className="bg-slate-100 dark:bg-slate-900/70 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Ready to inspect your files? You can test the workflow with your own ZIP or try our synthetic sample archive.
          </p>
        </div>
        <Link
          href="/check"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shrink-0 transition-colors shadow-sm"
        >
          Open Workspace
        </Link>
      </div>
    </div>
  );
}
