// Zod validation schemas for API requests matching Section C2 of specification

import { z } from "zod";

// Schema for saving a scan summary record via POST /api/reports
export const CreateReportSchema = z
  .object({
    clientResultId: z.string().min(1).max(100),
    engineVersion: z.string().min(1).max(20),
    sourceFormat: z.literal("notion_markdown_csv"),
    resultKind: z.enum(["scan_only", "checked_copy", "repaired"]),
    fileCount: z.number().int().min(0).max(2500),
    markdownCount: z.number().int().min(0).max(2500),
    checkedReferenceCount: z.number().int().min(0).max(100000),
    issueCountBefore: z.number().int().min(0).max(200000),
    issueCountAfter: z.number().int().min(0).max(200000),
    appliedChangeCount: z.number().int().min(0).max(100000),
    uncheckedFileCount: z.number().int().min(0).max(2500),
    archiveName: z.string().max(150).optional(),
  })
  .refine((data) => data.markdownCount <= data.fileCount, {
    message: "Markdown count cannot exceed total file count",
    path: ["markdownCount"],
  })
  .refine((data) => data.uncheckedFileCount <= data.fileCount, {
    message: "Unchecked file count cannot exceed total file count",
    path: ["uncheckedFileCount"],
  });

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

// Schema for updating user profile via PATCH /api/profile
export const UpdateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
