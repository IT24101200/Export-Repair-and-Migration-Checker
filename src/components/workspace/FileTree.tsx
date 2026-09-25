"use client";

import { useState } from "react";
import { ArchiveEntry, FileKind } from "@/lib/types/workspace";
import { Search, FileText, Image as ImageIcon, Table, File, Folder, ChevronDown, ChevronUp } from "lucide-react";

interface FileTreeProps {
  files: ArchiveEntry[];
  selectedFileId?: string;
  onSelectFile?: (file: ArchiveEntry) => void;
}

export default function FileTree({ files, selectedFileId, onSelectFile }: FileTreeProps) {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const filtered = files.filter((f) => {
    const matchesSearch = f.path.toLowerCase().includes(search.toLowerCase());
    const matchesKind = kindFilter === "all" ? true : f.kind === kindFilter;
    return matchesSearch && matchesKind;
  });

  const getFileIcon = (kind: FileKind) => {
    switch (kind) {
      case "markdown":
        return <FileText className="w-4 h-4 text-indigo-500 shrink-0" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-teal-500 shrink-0" />;
      case "csv":
        return <Table className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <File className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-colors">
      {/* Mobile toggle bar (collapsible on small screens, always visible on desktop) */}
      <div className="lg:hidden p-3.5 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-800 dark:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Archive Files ({files.length})</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            <span>{isMobileExpanded ? "Hide files" : "Show files"}</span>
            {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>
      </div>

      {/* Main tree content: Collapsible on mobile, block on lg */}
      <div className={`${isMobileExpanded ? "block" : "hidden"} lg:flex lg:flex-col lg:h-[560px]`}>
        {/* Header and Search */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="hidden lg:flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Archive Inventory
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {filtered.length} of {files.length}
            </span>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter files in archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Filter tags */}
          <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setKindFilter("all")}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                kindFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setKindFilter("markdown")}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                kindFilter === "markdown"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => setKindFilter("image")}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                kindFilter === "image"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              Images
            </button>
            <button
              type="button"
              onClick={() => setKindFilter("csv")}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                kindFilter === "csv"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              CSV
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="max-h-[300px] lg:flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No matching files found.
            </div>
          ) : (
            filtered.map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onSelectFile && onSelectFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-2 text-xs transition-colors ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-medium"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(file.kind)}
                    <span className="truncate font-mono text-[11px]" title={file.path}>
                      {file.path}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                    {formatBytes(file.sizeBytes)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
