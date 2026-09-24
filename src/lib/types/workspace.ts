// Type definitions for Export Repair workspace, files, issues, and repairs

export type FileKind = 'markdown' | 'image' | 'csv' | 'other';

export interface ArchiveEntry {
  id: string;
  path: string;
  name: string;
  kind: FileKind;
  sizeBytes: number;
}

export type IssueCategory =
  | 'broken_note_link'
  | 'missing_image'
  | 'case_mismatch'
  | 'ambiguous_target'
  | 'long_path'
  | 'unchecked_content'
  | 'unsupported_syntax';

export type IssueSeverity = 'error' | 'warning' | 'info';

export type IssueStatus = 'pending' | 'approved' | 'skipped';

export interface IssueItem {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  sourceFile: string;
  line: number;
  explanation: string;
  linkText: string;
  originalTarget: string;
  suggestedTarget?: string;
  candidates?: string[];
  status: IssueStatus;
  reason?: string;
  codeSnippet?: string;
}

export interface ApprovedChange {
  issueId: string;
  sourceFile: string;
  oldTarget: string;
  newTarget: string;
  reason: string;
}

export interface ScanCoverage {
  checkedFiles: number;
  totalFiles: number;
  checkedMarkdownNotes: number;
  checkedReferences: number;
  skippedFiles: number;
  skippedReasons: string[];
}

export interface WorkspaceSummary {
  clientResultId: string;
  engineVersion: string;
  sourceFormat: 'notion_markdown_csv';
  resultKind: 'scan_only' | 'checked_copy' | 'repaired';
  fileCount: number;
  markdownCount: number;
  imageCount: number;
  csvCount: number;
  checkedReferenceCount: number;
  issueCountBefore: number;
  issueCountAfter: number;
  appliedChangeCount: number;
  uncheckedFileCount: number;
  archiveName?: string;
  archiveSizeBytes?: number;
}

export type WorkspaceStep = 'choose' | 'scanning' | 'review' | 'building' | 'download';
