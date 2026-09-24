// ZIP Archive Scanner using @zip.js/zip.js to read files and diagnose broken references

import {
  ZipReader,
  BlobReader,
  TextWriter,
  Entry,
} from "@zip.js/zip.js";
import {
  ArchiveEntry,
  FileKind,
  IssueItem,
  ScanCoverage,
  WorkspaceSummary,
} from "@/lib/types/workspace";
import {
  normalizeSlashes,
  getDirectoryName,
  resolveRelativePath,
  isExternalLink,
  stripNotionExportId,
  makeRelativePath,
} from "./pathUtils";
import { scanMarkdownReferences } from "./markdownScanner";

export interface ScanResult {
  files: ArchiveEntry[];
  issues: IssueItem[];
  coverage: ScanCoverage;
  summary: WorkspaceSummary;
  noteContents: Map<string, string>; // path -> full text
}

// Determines the file type from its extension
function getFileKind(filename: string): FileKind {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "markdown";
  if (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".svg") ||
    lower.endsWith(".webp")
  )
    return "image";
  if (lower.endsWith(".csv")) return "csv";
  return "other";
}

// Main function to scan a Notion export ZIP File
export async function scanArchive(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ScanResult> {
  // Validate basic budget limits
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("Selected archive exceeds 50 MiB limit.");
  }

  onProgress?.(10, "Opening ZIP archive and verifying structure...");

  const reader = new ZipReader(new BlobReader(file));
  let entries: Entry[];

  try {
    entries = await reader.getEntries();
  } catch (err: any) {
    await reader.close();
    throw new Error("Invalid or corrupted ZIP archive: " + (err?.message || "cannot read central directory"));
  }

  if (entries.length > 2500) {
    await reader.close();
    throw new Error("Archive contains more than 2,500 entries, exceeding safe in-browser processing limit.");
  }

  const files: ArchiveEntry[] = [];
  const noteContents = new Map<string, string>();
  const pathSet = new Set<string>(); // Exact normalized paths
  const lowerPathMap = new Map<string, string>(); // lowerPath -> actualPath

  // 1. Build file inventory
  let entryIndex = 0;
  for (const entry of entries) {
    entryIndex++;
    if (entry.directory) continue; // Skip directories

    const normPath = normalizeSlashes(entry.filename);
    const fileName = normPath.split("/").pop() || normPath;
    const kind = getFileKind(fileName);
    const size = entry.uncompressedSize || 0;

    files.push({
      id: `file-${entryIndex}`,
      path: normPath,
      name: fileName,
      kind,
      sizeBytes: size,
    });

    pathSet.add(normPath);
    lowerPathMap.set(normPath.toLowerCase(), normPath);
  }

  onProgress?.(30, `Reading ${files.filter((f) => f.kind === "markdown").length} Markdown notes...`);

  // 2. Read all Markdown text contents
  const markdownFiles = files.filter((f) => f.kind === "markdown");
  let readCount = 0;

  for (const mf of markdownFiles) {
    const entry = entries.find((e) => normalizeSlashes(e.filename) === mf.path);
    if (entry && !entry.directory && (entry as any).getData) {
      try {
        const textWriter = new TextWriter();
        const text = await (entry as any).getData(textWriter);
        noteContents.set(mf.path, text);
      } catch (e) {
        console.warn("Could not read text of note:", mf.path, e);
      }
    }
    readCount++;
    if (onProgress && markdownFiles.length > 0) {
      onProgress(30 + Math.floor((readCount / markdownFiles.length) * 30), `Reading note ${readCount} of ${markdownFiles.length}...`);
    }
  }

  await reader.close();

  onProgress?.(65, "Inspecting links and image references...");

  // 3. Scan references and check against inventory
  const issues: IssueItem[] = [];
  let checkedReferences = 0;
  let issueCounter = 0;

  for (const [sourcePath, text] of noteContents.entries()) {
    const sourceDir = getDirectoryName(sourcePath);
    const refs = scanMarkdownReferences(text);

    for (const ref of refs) {
      // Skip external links (http, https, mailto)
      if (isExternalLink(ref.target)) continue;

      // Skip empty or fragment-only links (#section)
      if (ref.target.startsWith("#") || !ref.target) continue;

      checkedReferences++;

      // Resolve relative path from source note
      const resolved = resolveRelativePath(sourceDir, ref.target);

      // Check if target exists exactly in archive
      if (resolved && pathSet.has(resolved)) {
        // Link is healthy! No issue.
        continue;
      }

      issueCounter++;

      // Case 1: Case mismatch (e.g. assets/img.png vs Assets/img.png)
      if (resolved && lowerPathMap.has(resolved.toLowerCase())) {
        const actualCasedPath = lowerPathMap.get(resolved.toLowerCase())!;
        const suggestedTarget = makeRelativePath(sourceDir, actualCasedPath);

        issues.push({
          id: `iss-${issueCounter}`,
          category: "case_mismatch",
          severity: "warning",
          sourceFile: sourcePath,
          line: ref.line,
          explanation: `Letter casing mismatch. Target found on disk with different casing: "${actualCasedPath}".`,
          linkText: ref.linkText,
          originalTarget: ref.target,
          suggestedTarget,
          candidates: [actualCasedPath],
          status: "pending",
          reason: "Case-insensitive match on disk",
          codeSnippet: ref.rawMatch,
        });
        continue;
      }

      // Case 2: Broken note link or missing image — search for candidates by base filename / Notion ID
      const targetBaseName = ref.target.split("/").pop() || ref.target;
      const cleanTargetTitle = stripNotionExportId(decodeURIComponent(targetBaseName)).toLowerCase();

      // Find candidate matches across all archive files
      const candidateFiles = files.filter((f) => {
        const fClean = stripNotionExportId(f.name).toLowerCase();
        return fClean === cleanTargetTitle || f.name.toLowerCase() === targetBaseName.toLowerCase();
      });

      if (candidateFiles.length === 1) {
        // Unique candidate found!
        const match = candidateFiles[0];
        const suggestedTarget = makeRelativePath(sourceDir, match.path);

        issues.push({
          id: `iss-${issueCounter}`,
          category: ref.isImage ? "case_mismatch" : "broken_note_link",
          severity: "error",
          sourceFile: sourcePath,
          line: ref.line,
          explanation: `Referenced file not found at original relative location. A unique match was found at: "${match.path}".`,
          linkText: ref.linkText,
          originalTarget: ref.target,
          suggestedTarget,
          candidates: [match.path],
          status: "pending",
          reason: "Unique candidate match in archive",
          codeSnippet: ref.rawMatch,
        });
      } else if (candidateFiles.length > 1) {
        // Ambiguous matches! Multiple files share this base title
        issues.push({
          id: `iss-${issueCounter}`,
          category: "ambiguous_target",
          severity: "warning",
          sourceFile: sourcePath,
          line: ref.line,
          explanation: `Multiple files in different folders match this name. Please select the intended target file.`,
          linkText: ref.linkText,
          originalTarget: ref.target,
          candidates: candidateFiles.map((c) => c.path),
          status: "pending",
          reason: "Multiple files match the title",
          codeSnippet: ref.rawMatch,
        });
      } else {
        // No match found anywhere
        issues.push({
          id: `iss-${issueCounter}`,
          category: ref.isImage ? "missing_image" : "broken_note_link",
          severity: "error",
          sourceFile: sourcePath,
          line: ref.line,
          explanation: ref.isImage
            ? "Referenced image file does not exist anywhere in this export archive."
            : "Referenced note does not exist anywhere in this export archive.",
          linkText: ref.linkText,
          originalTarget: ref.target,
          status: "pending",
          reason: "No file with this name or hash found in archive",
          codeSnippet: ref.rawMatch,
        });
      }
    }
  }

  // 4. Check for long paths (> 120 chars)
  for (const f of files) {
    if (f.path.length > 120) {
      issueCounter++;
      issues.push({
        id: `iss-${issueCounter}`,
        category: "long_path",
        severity: "info",
        sourceFile: f.path,
        line: 1,
        explanation: `Path length is ${f.path.length} characters (exceeds 120). May cause issues when extracting on standard Windows folders.`,
        linkText: "File Path",
        originalTarget: f.path,
        status: "pending",
        reason: "Portability notice: long path hierarchy",
      });
    }
  }

  onProgress?.(100, "Scan complete! Preparing results...");

  const csvCount = files.filter((f) => f.kind === "csv").length;
  const imageCount = files.filter((f) => f.kind === "image").length;

  const coverage: ScanCoverage = {
    totalFiles: files.length,
    checkedFiles: files.length,
    checkedMarkdownNotes: markdownFiles.length,
    checkedReferences,
    skippedFiles: csvCount,
    skippedReasons: csvCount > 0 ? [`${csvCount} CSV files left unmodified to preserve spreadsheet structure`] : [],
  };

  const summary: WorkspaceSummary = {
    clientResultId: "scan-" + Date.now(),
    engineVersion: "1.0.0",
    sourceFormat: "notion_markdown_csv",
    resultKind: "scan_only",
    fileCount: files.length,
    markdownCount: markdownFiles.length,
    imageCount,
    csvCount,
    checkedReferenceCount: checkedReferences,
    issueCountBefore: issues.length,
    issueCountAfter: issues.length,
    appliedChangeCount: 0,
    uncheckedFileCount: csvCount,
    archiveName: file.name,
    archiveSizeBytes: file.size,
  };

  return {
    files,
    issues,
    coverage,
    summary,
    noteContents,
  };
}
