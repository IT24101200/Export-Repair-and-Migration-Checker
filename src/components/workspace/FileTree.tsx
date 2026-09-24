"use client";

import { useState } from "react";
import { ArchiveEntry, FileKind } from "@/lib/types/workspace";
import { Search, FileText, Image as ImageIcon, Table, File, Folder } from "lucide-react";

interface FileTreeProps {
  files: ArchiveEntry[];
  selectedFileId?: string;
  onSelectFile?: (file: ArchiveEntry) => void;
}

export default function FileTree({ files, selectedFileId, onSelectFile }: FileTreeProps) {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("all");

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
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[560px] overflow-hidden">
      {/* Header and Search */}
      <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-slate-500" />
            Archive Inventory
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
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
            className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setKindFilter("all")}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              kindFilter === "all" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setKindFilter("markdown")}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              kindFilter === "markdown" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            Notes
          </button>
          <button
            type="button"
            onClick={() => setKindFilter("image")}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              kindFilter === "image" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            Images
          </button>
          <button
            type="button"
            onClick={() => setKindFilter("csv")}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              kindFilter === "csv" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            CSV
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
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
                  isSelected ? "bg-indigo-50 text-indigo-900 font-medium" : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getFileIcon(file.kind)}
                  <span className="truncate font-mono text-[11px]" title={file.path}>
                    {file.path}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {formatBytes(file.sizeBytes)}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
