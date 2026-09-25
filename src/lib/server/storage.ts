// Lightweight in-memory/session data store for scan summary metadata
// Strictly stores only numeric counts and metadata — never files or note contents

import { CreateReportInput } from "@/lib/validation/reports";

export interface StoredSummaryRecord {
  id: string;
  userId: string;
  clientResultId: string;
  title: string;
  date: string;
  createdAt: string;
  engineVersion: string;
  sourceFormat: "notion_markdown_csv";
  resultKind: "scan_only" | "checked_copy" | "repaired";
  fileCount: number;
  markdownCount: number;
  checkedReferenceCount: number;
  issueCountBefore: number;
  issueCountAfter: number;
  appliedChangeCount: number;
  uncheckedFileCount: number;
}

export interface StoredFeedbackRecord {
  id: string;
  userId: string;
  clientFeedbackId: string;
  schemaVersion: number;
  engineVersion: string;
  sourceFormat: "notion_markdown_csv";
  outcome: "helped" | "partly_helped" | "not_helped" | "not_sure";
  reasonCode: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

// Global in-memory storage for development and mini-hackathon runtime
declare global {
  var __appStorage: {
    user: UserProfile;
    reports: StoredSummaryRecord[];
    feedback: StoredFeedbackRecord[];
  } | undefined;
}

if (!globalThis.__appStorage) {
  globalThis.__appStorage = {
    user: {
      id: "usr-001",
      email: "student.developer@example.com",
      displayName: "Student Developer",
      createdAt: new Date().toISOString(),
    },
    reports: [
      {
        id: "rep-001",
        userId: "usr-001",
        clientResultId: "client-res-001",
        title: "Report — 24 September 2026",
        date: "2026-09-24 18:30",
        createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        engineVersion: "1.0.0",
        sourceFormat: "notion_markdown_csv",
        resultKind: "repaired",
        fileCount: 42,
        markdownCount: 28,
        checkedReferenceCount: 94,
        issueCountBefore: 7,
        issueCountAfter: 2,
        appliedChangeCount: 5,
        uncheckedFileCount: 2,
      },
      {
        id: "rep-002",
        userId: "usr-001",
        clientResultId: "client-res-002",
        title: "Report — 23 September 2026",
        date: "2026-09-23 11:15",
        createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
        engineVersion: "1.0.0",
        sourceFormat: "notion_markdown_csv",
        resultKind: "scan_only",
        fileCount: 18,
        markdownCount: 14,
        checkedReferenceCount: 32,
        issueCountBefore: 3,
        issueCountAfter: 3,
        appliedChangeCount: 0,
        uncheckedFileCount: 0,
      },
    ],
    feedback: [],
  };
}

const storage = globalThis.__appStorage;

// Get current user profile
export function getUserProfile(): UserProfile {
  return storage.user;
}

// Update user display name
export function updateUserProfile(displayName: string): UserProfile {
  storage.user.displayName = displayName;
  return storage.user;
}

// List user's reports (newest first)
export function listUserReports(limit: number = 20): StoredSummaryRecord[] {
  return [...storage.reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, Math.min(limit, 50));
}

// Get single report by ID
export function getReportById(id: string): StoredSummaryRecord | null {
  const found = storage.reports.find((r) => r.id === id);
  return found || null;
}

// Save a new summary record (with idempotency handling)
export function createReportRecord(input: CreateReportInput): {
  record: StoredSummaryRecord;
  status: "created" | "existing" | "conflict";
} {
  // Check for existing record by clientResultId (Idempotency check)
  const existing = storage.reports.find((r) => r.clientResultId === input.clientResultId);
  if (existing) {
    // If identical, return existing record safely
    if (
      existing.fileCount === input.fileCount &&
      existing.appliedChangeCount === input.appliedChangeCount &&
      existing.issueCountBefore === input.issueCountBefore
    ) {
      return { record: existing, status: "existing" };
    }
    // Conflicting data with same clientResultId
    return { record: existing, status: "conflict" };
  }

  const dateObj = new Date();
  const dateFormatted = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const newRecord: StoredSummaryRecord = {
    id: `rep-${Date.now().toString().slice(-6)}`,
    userId: storage.user.id,
    clientResultId: input.clientResultId,
    title: `Report — ${dateFormatted}`,
    date: dateObj.toISOString().slice(0, 16).replace("T", " "),
    createdAt: dateObj.toISOString(),
    engineVersion: input.engineVersion,
    sourceFormat: input.sourceFormat,
    resultKind: input.resultKind,
    fileCount: input.fileCount,
    markdownCount: input.markdownCount,
    checkedReferenceCount: input.checkedReferenceCount,
    issueCountBefore: input.issueCountBefore,
    issueCountAfter: input.issueCountAfter,
    appliedChangeCount: input.appliedChangeCount,
    uncheckedFileCount: input.uncheckedFileCount,
  };

  storage.reports.unshift(newRecord);
  return { record: newRecord, status: "created" };
}

// Delete single summary by ID
export function deleteReportRecord(id: string): boolean {
  const initialLength = storage.reports.length;
  storage.reports = storage.reports.filter((r) => r.id !== id);
  return storage.reports.length < initialLength;
}

// Delete user account and all saved summaries and feedback
export function deleteUserAccount(): void {
  storage.reports = [];
  storage.feedback = [];
  storage.user = {
    id: "usr-guest",
    email: "guest@example.com",
    displayName: "Guest",
    createdAt: new Date().toISOString(),
  };
}

// List user feedback records (newest first)
export function listUserFeedback(): StoredFeedbackRecord[] {
  if (!storage.feedback) storage.feedback = [];
  return [...storage.feedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Save a new feedback record with idempotency check
export function createFeedbackRecord(input: import("@/lib/validation/feedback").CreateFeedbackInput): {
  record: StoredFeedbackRecord;
  status: "created" | "existing" | "conflict";
} {
  if (!storage.feedback) storage.feedback = [];

  const existing = storage.feedback.find((f) => f.clientFeedbackId === input.clientFeedbackId);
  if (existing) {
    if (existing.outcome === input.outcome && existing.reasonCode === input.reasonCode) {
      return { record: existing, status: "existing" };
    }
    return { record: existing, status: "conflict" };
  }

  const newRecord: StoredFeedbackRecord = {
    id: `fb-${Date.now().toString().slice(-6)}`,
    userId: storage.user.id,
    clientFeedbackId: input.clientFeedbackId,
    schemaVersion: input.schemaVersion,
    engineVersion: input.engineVersion,
    sourceFormat: input.sourceFormat,
    outcome: input.outcome,
    reasonCode: input.reasonCode,
    createdAt: new Date().toISOString(),
  };

  storage.feedback.unshift(newRecord);
  return { record: newRecord, status: "created" };
}

// Delete single feedback record by ID
export function deleteFeedbackRecord(id: string): boolean {
  if (!storage.feedback) storage.feedback = [];
  const initialLength = storage.feedback.length;
  storage.feedback = storage.feedback.filter((f) => f.id !== id);
  return storage.feedback.length < initialLength;
}
